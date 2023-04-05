import opcodes, { ParameterType } from "./opcodes";

enum ParameterMode {
	Position,
	Immediate,
	Relative,
}

class IntcodeError extends Error {
	constructor(vm: IntcodeVM, message: string) {
		super(
			`Error in Intcode VM at address ${vm.instructionPointer}: ${message}`
		);
	}
}

export class IntcodeVM {
	program: number[] = [];

	halted = true;

	private memory: number[] = [];

	private _instructionPointer = 0;
	private instructionPointerModifiedThisCycle = false;
	get instructionPointer() {
		return this._instructionPointer;
	}
	set instructionPointer(value: number) {
		this._instructionPointer = value;
		this.instructionPointerModifiedThisCycle = true;
	}

	relativeBase = 0;

	inputBuffer: number[] = [];
	outputBuffer: number[] = [];

	constructor() {}

	reset() {
		this.halted = false;
		this.memory = [...this.program];
		this.instructionPointer = 0;
		this.instructionPointerModifiedThisCycle = false;
	}

	loadProgram(programData: string) {
		this.program = programData.split(",").map((int) => parseInt(int));
		this.reset();
	}

	step() {
		if (this.halted) {
			this.throwVMError(
				"Program has finished running, cannot execute instruction"
			);
		}

		const opcodeId = this.readMemory(this.instructionPointer) % 100;
		const opcode = opcodes[opcodeId];
		if (!opcode) {
			this.throwVMError(`Invalid opcode ${opcodeId}`);
		}

		const args = opcode.parameters.map(this.getArgForParameter());

		opcode.action(this, ...args);
		if (this.halted) {
			return false;
		}

		if (!this.instructionPointerModifiedThisCycle) {
			this.instructionPointer += opcode.stride;
		}

		this.instructionPointerModifiedThisCycle = false;
		return true;
	}

	runUntilComplete() {
		while (this.step()) {}
		return [...this.memory];
	}

	runUntilOutput() {
		if (this.halted) {
			return undefined;
		}

		const prevOutputLen = this.outputBuffer.length;
		while (this.step() && this.outputBuffer.length === prevOutputLen) {}
		return this.halted ? undefined : this.outputBuffer.pop();
	}

	writeMemory(address: number, value: number) {
		if (address < 0) {
			this.throwVMError("Memory address must be positive");
		}

		this.memory[address] = value;
	}

	readMemory(address: number) {
		if (address < 0) {
			this.throwVMError("Memory address must be positive");
		}

		return this.memory[address] ?? 0;
	}

	writeInput(input: number) {
		this.inputBuffer.push(input);
	}

	readInput(): number | undefined {
		return this.inputBuffer.shift();
	}

	writeOutput(output: number) {
		this.outputBuffer.push(output);
	}

	readOutput(): number | undefined {
		return this.outputBuffer.shift();
	}

	private decodeParameterModes(): ParameterMode[] {
		return Math.floor(this.readMemory(this.instructionPointer) / 100)
			.toString()
			.split("")
			.map(Number)
			.reverse();
	}

	private getArgForParameter() {
		const parameterModes = this.decodeParameterModes();

		return (parameter: ParameterType, index: number) => {
			const argument = this.readMemory(
				this.instructionPointer + 1 + index
			);

			const mode = parameterModes[index] ?? ParameterMode.Position;
			if (mode === ParameterMode.Immediate) {
				if (parameter === ParameterType.Write) {
					this.throwVMError("Cannot write to an immediate parameter");
				}

				return argument;
			}

			const address = this.getAddressForParameter(mode, argument);
			return parameter === ParameterType.Read
				? this.readMemory(address)
				: address;
		};
	}

	private getAddressForParameter(mode: ParameterMode, argument: number) {
		switch (mode) {
			case ParameterMode.Position:
				return argument;
			case ParameterMode.Relative:
				return this.relativeBase + argument;
			case ParameterMode.Immediate:
				this.throwVMError(
					"Cannot interpret immediate mode parameter as an address"
				);
			default:
				this.throwVMError(`Invalid parameter mode ${mode}`);
		}
	}

	private throwVMError(message: string): never {
		throw new IntcodeError(this, message);
	}
}
