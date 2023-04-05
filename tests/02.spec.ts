import { IntcodeVM } from "intcode";
import solution from "solutions/day2";

describe("Day 2", () => {
	it("should pass the example program", () => {
		// Given
		const program = "1,9,10,3,2,3,11,0,99,30,40,50";
		const expected = 3500;

		const vm = new IntcodeVM();
		vm.loadProgram(program);

		// When
		const result = vm.runUntilComplete();

		// Then
		expect(result[0]).toBe(expected);
	});

	it("should solve part 1", () => {
		// When
		const result = solution.runPart1();

		// Then
		expect(result).resolves.toBe(5534943);
	});

	it("should solve part 2", () => {
		// When
		const result = solution.runPart2();

		// Then
		expect(result).resolves.toBe(7603);
	});
});
