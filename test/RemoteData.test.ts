import {
  RemoteData,
  notAsked,
  loading,
  success,
  failure,
  failureData,
  isNotAsked,
  isLoading,
  isSuccess,
  isFailure,
} from "../lib/RemoteData";
import { DataError } from "../lib/DataError";

describe("Constructors", () => {
  it("should create RemoteData values", () => {
    expect(typeof notAsked).toBe("symbol");
    expect(isNotAsked(notAsked)).toBeTruthy();
    expect(isLoading(notAsked)).toBeFalsy();
    expect(isSuccess(notAsked)).toBeFalsy();
    expect(isFailure(notAsked)).toBeFalsy();
    expect(notAsked).not.toEqual(loading);

    expect(typeof loading).toBe("symbol");
    expect(isNotAsked(loading)).toBeFalsy();
    expect(isLoading(loading)).toBeTruthy();
    expect(isSuccess(loading)).toBeFalsy();
    expect(isFailure(loading)).toBeFalsy();
    expect(loading).not.toEqual(notAsked);

    expect(success(1)).toBe(1);
    expect(success("abc")).toBe("abc");
    expect(isNotAsked(1)).toBeFalsy();
    expect(isLoading(success("xyz"))).toBeFalsy();
    expect(isSuccess(false)).toBeTruthy();
    expect(isFailure(success(1))).toBeFalsy();

    expect(failure() instanceof Error).toBe(true);
    expect(failureData("oops") instanceof Error).toBe(true);
    expect(failureData("oops").data).toBe("oops");
    expect(isNotAsked(failure())).toBeFalsy();
    expect(isLoading(failure())).toBeFalsy();
    expect(isSuccess(failure())).toBeFalsy();
    expect(isFailure(failure())).toBeTruthy();
    expect(isFailure(failureData("oops"))).toBeTruthy();

    expect(RemoteData.of("yay!")).toBe("yay!");
    expect(RemoteData.Success.of("yay!")).toBe("yay!");
  });
});

describe("README example", () => {
  const fetchDogImage: jest.Mock<Promise<any>> = jest.fn();

  type DogRequest = RemoteData<string, DogError>;
  type DogError = DataError<{ message: string; code?: number }>;

  let dogImageRequest: DogRequest = notAsked;

  async function getDogImage(): Promise<void> {
    dogImageRequest = RemoteData.loading;

    try {
      const json = await fetchDogImage();

      if (json.status === "success") {
        dogImageRequest = RemoteData.success(json.message);
      } else {
        dogImageRequest = RemoteData.failureData({
          message: json.message,
          code: json.code,
        });
      }
    } catch {
      dogImageRequest = RemoteData.failureData({ message: "Request failed" });
    }
  }

  function displayDogImage(dogImage: DogRequest): string {
    return RemoteData.caseOf(dogImage, {
      NotAsked: () => "Request a dog!",
      Loading: () => "Loading!",
      Success: (url) => `Here's your dog! ${url}`,
      Failure: (err) => `Error: ${err.data.message}`,
    });
  }

  it("starts with a request that is not asked", () => {
    expect(isNotAsked(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toBe(notAsked);
    expect(displayDogImage(dogImageRequest)).toBe("Request a dog!");
  });

  it("succeeds when the request payload is a success", async () => {
    fetchDogImage.mockResolvedValueOnce({
      status: "success",
      message: `https://images.dog.ceo/breeds/hound-basset/n02088238_5239.jpg`,
    });

    const promise = getDogImage();

    expect(isLoading(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toBe(loading);
    expect(displayDogImage(dogImageRequest)).toBe("Loading!");

    await promise;

    expect(isSuccess(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toBe(
      `https://images.dog.ceo/breeds/hound-basset/n02088238_5239.jpg`,
    );
    expect(displayDogImage(dogImageRequest)).toBe(
      `Here's your dog! https://images.dog.ceo/breeds/hound-basset/n02088238_5239.jpg`,
    );
  });

  it("fails when the request payload is an error", async () => {
    fetchDogImage.mockResolvedValueOnce({
      status: "error",
      message: "Dog not found",
      code: 404,
    });

    const promise = getDogImage();

    expect(isLoading(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toBe(loading);
    expect(displayDogImage(dogImageRequest)).toBe("Loading!");

    await promise;

    expect(isFailure(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toMatchObject({
      data: {
        message: "Dog not found",
        code: 404,
      },
    });
    expect(displayDogImage(dogImageRequest)).toBe("Error: Dog not found");
  });

  it("fails when the request fails", async () => {
    fetchDogImage.mockRejectedValueOnce(new Error("There are no more dogs"));

    const promise = getDogImage();

    expect(isLoading(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toBe(loading);
    expect(displayDogImage(dogImageRequest)).toBe("Loading!");

    await promise;

    expect(isFailure(dogImageRequest)).toBeTruthy();
    expect(dogImageRequest).toMatchObject({
      data: {
        message: "Request failed",
      },
    });
    expect(displayDogImage(dogImageRequest)).toBe("Error: Request failed");
  });
});
