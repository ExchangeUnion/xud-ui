import { getNextRoute } from "./create-effect";
import { TestScheduler } from "rxjs/testing";

let testScheduler: TestScheduler;

describe("nextStep$", () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("fails", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const expected = "(a|)";
      expectObservable(getNextRoute()).toBe(expected, { a: true });
    });
  });
});
