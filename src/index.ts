import solutions from "./solutions";

solutions.forEach((solution) => {
	const result = solution.run();

	console.log(solution.name);
	console.log(result.part1, result.part2);
});
