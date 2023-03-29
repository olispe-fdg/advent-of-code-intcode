import { IntcodeVM } from "../src/intcode";
import solution from "../src/solutions/day9";

describe("Day 9", () => {
	describe("part 1 examples", () => {
		it("should pass example 1", () => {
			// Given
			const program = [
				109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006,
				101, 0, 99,
			];

			const vm = new IntcodeVM();
			vm.loadProgram(program.join(","));

			// When
			vm.runUntilComplete();

			// Then
			expect(vm.outputBuffer).toEqual(program);
		});

		it("should pass example 2", () => {
			// Given
			const program = "1102,34915192,34915192,7,4,7,99,0";

			const vm = new IntcodeVM();
			vm.loadProgram(program);

			// When
			vm.runUntilComplete();

			// Then
			expect(vm.readOutput()?.toString()).toMatch(/\d{16}/);
		});

		it("should pass example 3", () => {
			// Given
			const program = [104, 1125899906842624, 99];

			const vm = new IntcodeVM();
			vm.loadProgram(program.join(","));

			// When
			vm.runUntilComplete();

			// Then
			expect(vm.readOutput()).toBe(program[1]);
		});
	});

	it("should solve part 1", () => {
		// When
		const result = solution.runPart1();

		// Then
		expect(result).toBe(2494485073);
	});
});
