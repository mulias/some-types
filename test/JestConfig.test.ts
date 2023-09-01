describe("Timezones", () => {
  it("should always be EST (UTC-05:00)", () => {
    expect(new Date().getTimezoneOffset()).toBe(300);
  });
});
