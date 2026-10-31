/**
 * Stepper: one list item per step, each carrying its own state. Screen readers
 * get the label; the line after an item only takes the accent color when it
 * leads somewhere the user has reached.
 */
import { createRoot } from "@wordpress/element";
import { StepNumber, Stepper } from "../index";

// @wordpress/components pulls in an ES-only package that Jest can't load here.
jest.mock("@wordpress/components", () => {
	const { createElement } = require("@wordpress/element");

	return {
		VisuallyHidden: ({ children }) =>
			createElement("span", { className: "visually-hidden" }, children),
	};
});

const ACCENT = "var(--wp-admin-theme-color, #3858e9)";
const BORDER = "#e0e0e0";

const mounted = [];

async function render(element) {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	root.render(element);
	mounted.push({ root, container });

	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));

	return container;
}

function steps(...states) {
	return states.map((state, index) => ({
		key: `step-${index}`,
		label: `Label ${index + 1}`,
		state,
	}));
}

const listItems = (container) => [...container.querySelectorAll("li")];

/** An item's ::after rule, from the stylesheet Emotion writes to. */
function lineRule(item) {
	const className = [...item.classList].find((name) =>
		name.startsWith("css-"),
	);
	const rules = [...document.styleSheets].flatMap((sheet) => [
		...sheet.cssRules,
	]);

	return rules.find((rule) => rule.selectorText === `.${className}::after`)
		.cssText;
}

const hasLine = (item) => !lineRule(item).includes("content: none");

afterEach(() => {
	mounted.splice(0).forEach(({ root, container }) => {
		root.unmount();
		container.remove();
	});
});

describe("Stepper items", () => {
	test("renders one list item per entry, in order", async () => {
		const container = await render(
			<Stepper items={steps("done", "current", "todo")} />,
		);

		expect(container.querySelectorAll("ol")).toHaveLength(1);
		expect(listItems(container)).toHaveLength(3);
		expect(
			listItems(container).map(
				(item) => item.querySelector(".visually-hidden").textContent,
			),
		).toEqual(["Label 1", "Label 2", "Label 3"]);
	});

	test("renders an empty list for no items", async () => {
		const container = await render(<Stepper items={[]} />);

		expect(container.querySelector("ol")).not.toBeNull();
		expect(listItems(container)).toHaveLength(0);
	});

	test("shows the 1-based number, or a check when done", async () => {
		const container = await render(
			<Stepper items={steps("done", "current", "todo")} />,
		);
		const [done, current, todo] = listItems(container).map((item) =>
			item.querySelector('[aria-hidden="true"]'),
		);

		expect(done.querySelector("svg")).not.toBeNull();
		expect(done.textContent).toBe("");
		expect(current.textContent).toBe("2");
		expect(current.querySelector("svg")).toBeNull();
		expect(todo.textContent).toBe("3");
		expect(todo.querySelector("svg")).toBeNull();
	});

	test("the label is the only text outside the hidden number", async () => {
		const container = await render(<Stepper items={steps("todo")} />);
		const [item] = listItems(container);

		expect(item.textContent).toBe("1Label 1");
		expect(item.querySelector('[aria-hidden="true"]').textContent).toBe("1");
		expect(item.querySelector(".visually-hidden").textContent).toBe(
			"Label 1",
		);
	});

	test("aria-current appears only on current items", async () => {
		const container = await render(
			<Stepper items={steps("done", "current", "todo")} />,
		);

		expect(
			listItems(container).map((item) =>
				item.getAttribute("aria-current"),
			),
		).toEqual([null, "step", null]);
	});

	test("steps can finish in any order", async () => {
		const container = await render(
			<Stepper items={steps("todo", "done", "todo", "done")} />,
		);

		expect(
			listItems(container).map(
				(item) =>
					item.querySelector('[aria-hidden="true"] svg') !== null,
			),
		).toEqual([false, true, false, true]);
	});

	test("merges a className with its own", async () => {
		const container = await render(
			<Stepper items={[]} className="extra" />,
		);
		const list = container.querySelector("ol");

		expect(list.classList.contains("siratik-stepper")).toBe(true);
		expect(list.classList.contains("extra")).toBe(true);
	});
});

describe("Stepper line", () => {
	test.each([
		["done then done", ["done", "done"], ACCENT],
		["done then current", ["done", "current"], ACCENT],
		["done then todo", ["done", "todo"], BORDER],
		["current then todo", ["current", "todo"], BORDER],
		["current then done", ["current", "done"], BORDER],
		["todo then done", ["todo", "done"], BORDER],
		["todo then todo", ["todo", "todo"], BORDER],
	])("%s", async (_, states, color) => {
		const container = await render(<Stepper items={steps(...states)} />);
		const rule = lineRule(listItems(container)[0]);

		expect(rule).toContain(`background: ${color}`);
	});

	test("every item but the last has a line", async () => {
		const container = await render(
			<Stepper items={steps("done", "current", "todo")} />,
		);

		expect(listItems(container).map(hasLine)).toEqual([true, true, false]);
	});

	test("a single item has no line", async () => {
		const container = await render(<Stepper items={steps("done")} />);

		expect(listItems(container).map(hasLine)).toEqual([false]);
	});
});

describe("StepNumber", () => {
	test.each([["todo"], ["current"]])("%s shows the number", async (state) => {
		const container = await render(<StepNumber state={state} number={4} />);
		const number = container.firstChild;

		expect(number.textContent).toBe("4");
		expect(number.querySelector("svg")).toBeNull();
	});

	test("done shows a check instead of the number", async () => {
		const container = await render(<StepNumber state="done" number={4} />);
		const number = container.firstChild;

		expect(number.textContent).toBe("");
		expect(number.querySelector("svg")).not.toBeNull();
	});

	test("is hidden from screen readers", async () => {
		const container = await render(<StepNumber state="todo" number={1} />);

		expect(container.firstChild.getAttribute("aria-hidden")).toBe("true");
	});
});
