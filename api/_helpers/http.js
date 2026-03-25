module.exports = {
  ok(data) {
    return { status: 200, body: data };
  },
  error(status, msg) {
    return { status, body:{ message: msg }};
  },
  handle(context, fn) {
    (async () => {
      try {
        const result = await fn();
        context.res = result;
      } catch(err) {
        context.log(err);
        context.res = {
          status: err.status || 500,
          body: { message: err.message || "Erreur serveur" }
        };
      }
    })();
  }
};