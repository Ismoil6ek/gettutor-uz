export const stringMiddleWare = () => (next: any) => (action: any) => {
  if (typeof action == "string") {
    return next({ type: action });
  }
  return next(action);
};
