import { getNextRoute } from "./next-route";
import { TestScheduler } from "rxjs/testing";
import { Path } from "../../router/Path";
import { Observable } from "rxjs";

let testScheduler: TestScheduler;

type CreateFlowState = {
  isDownloaded: boolean;
  isInstalled: boolean;
  isRunning: boolean;
  rebootRequired: boolean;
};

const assertNextStep = (expectedPath: Path, dockerInfo: CreateFlowState) => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable } = helpers;
    const expected = "1s (a|)";
    const minimumRuntime = () =>
      (cold("1s a") as unknown) as Observable<number>;
    const isInstalled = () =>
      (cold("1s a", { a: dockerInfo.isInstalled }) as unknown) as Observable<
        boolean
      >;
    const isRunning = () =>
      (cold("1s a", { a: dockerInfo.isRunning }) as unknown) as Observable<
        boolean
      >;
    const isDownloaded = () =>
      (cold("1s a", { a: dockerInfo.isDownloaded }) as unknown) as Observable<
        boolean
      >;
    const rebootRequired = () =>
      (cold("1s a", { a: dockerInfo.rebootRequired }) as unknown) as Observable<
        boolean
      >;
    expectObservable(
      getNextRoute(
        minimumRuntime,
        isInstalled,
        isRunning,
        isDownloaded,
        rebootRequired
      )
    ).toBe(expected, {
      a: expectedPath,
    });
  });
};

describe("nextStep$", () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("directs to download", () => {
    const expectedPath = Path.DOWNLOAD_DOCKER;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isRunning: false,
      rebootRequired: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to install", () => {
    const expectedPath = Path.INSTALL_DOCKER;
    const dockerInfo = {
      isDownloaded: true,
      isInstalled: false,
      isRunning: false,
      rebootRequired: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to reboot", () => {
    const expectedPath = Path.RESTART_REQUIRED;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: false,
      isRunning: false,
      rebootRequired: true,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to starting xud", () => {
    const expectedPath = Path.STARTING_XUD;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: true,
      isRunning: true,
      rebootRequired: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });

  it("directs to waiting docker start", () => {
    const expectedPath = Path.WAITING_DOCKER_START;
    const dockerInfo = {
      isDownloaded: false,
      isInstalled: true,
      isRunning: false,
      rebootRequired: false,
    };
    assertNextStep(expectedPath, dockerInfo);
  });
});
