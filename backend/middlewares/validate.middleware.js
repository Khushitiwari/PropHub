// Express middleware: run Zod schemas on body, query, or params before controllers.
//
// Example: router.post("/register", validate({ body: registerSchema }), register);
//
// On success, parsed data is written back to req.body / req.query / req.params
// (numbers from FormData strings get coerced in the schema).
//
// On failure, sends 400 with { success: false, message, errors: [{ field, message }] }.

export function validate(schemas) {
  return (req, res, next) => {
    const collectedErrors = [];

    const targets = [
      ["body", req.body],
      ["query", req.query],
      ["params", req.params],
    ];

    for (const [key, schema] of Object.entries(schemas)) {
      if (!schema) continue;

      const source = targets.find(([name]) => name === key)?.[1];
      if (source === undefined) continue;

      const result = schema.safeParse(source);

      if (!result.success) {
        for (const issue of result.error.issues) {
          collectedErrors.push({
            field: issue.path.join(".") || key,
            message: issue.message,
          });
        }
        continue;
      }

      // Write validated data back onto the request object
      if (key === "body") {
        req.body = result.data;
      } else if (key === "query") {
        Object.assign(req.query, result.data);
      } else if (key === "params") {
        Object.assign(req.params, result.data);
      }
    }

    if (collectedErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: collectedErrors,
      });
    }

    next();
  };
}

export default validate;
