const isObject = (input: unknown): input is Record<string, unknown> =>
  typeof input === "object" && input !== null && !Array.isArray(input);

class Decoder<A> {
  public constructor(public decode: (input: unknown) => A) {}
}

const string = new Decoder((input) => {
  if (typeof input === "string") return input;
  throw new TypeError(`Expected a string but got ${String(input)}`);
});

const array = <A>(decoder: Decoder<A>) =>
  new Decoder((input) => {
    if (!Array.isArray(input))
      throw new Error(`Expected an array but got ${String(input)}`);
    return input.map((item: unknown) => decoder.decode(item));
  });

function object<A extends Record<string, unknown> = {}>(decoders: {
  [K in keyof A]: Decoder<A[K]>;
}): Decoder<A>;
function object(decoders: Record<string, Decoder<unknown>>) {
  const decoderEntries = Object.entries(decoders);
  return new Decoder((input) => {
    if (!isObject(input)) {
      throw new TypeError(`Expected an object but got ${String(input)}`);
    }
    const result: Record<string, unknown> = {};
    for (const [key, decoder] of decoderEntries) {
      if (!Object.hasOwn(input, key)) {
        throw new TypeError(`Missing property ${key}`);
      }
      result[key] = decoder.decode(input[key]);
    }
    return result;
  });
}

export { string, array, object };
