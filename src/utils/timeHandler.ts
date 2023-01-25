/**
 * @param returnType - choose time format you want to return
 * @param parameter - time value you have
 */
export default function timeHandler({
  returnType,
  parameter,
}: {
  returnType: "timestamp" | "time";
  parameter: string | number;
}) {
  const tempDate = new Date(
    typeof parameter === "string" ? parameter : parameter * 1000
  );

  if (returnType === "time") {
    return String(tempDate.toISOString().slice(0, 10));
  } else {
    return tempDate.getTime() / 1000;
  }
}
