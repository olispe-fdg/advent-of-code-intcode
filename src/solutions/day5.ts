import { IntcodeVM } from "intcode";
import { Solution } from "./Solution";

function solution1(program: string) {
	const vm = new IntcodeVM();

	vm.loadProgram(program);
	vm.writeInput(1);

	vm.runUntilComplete();

	const diagnosticCode = vm.outputBuffer.pop();
	if (diagnosticCode === undefined) {
		throw new Error("No output was received");
	}

	vm.outputBuffer.forEach((output) => {
		if (output !== 0) {
			throw new Error("Tests did not pass");
		}
	});

	return diagnosticCode;
}

export default new Solution("Day 5", solution1);
