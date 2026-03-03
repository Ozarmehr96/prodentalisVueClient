import dayjs from "dayjs";
export function getDefaultPeriod() {
    const now = dayjs();

    return {
        date_to: now.date(27).format("YYYY-MM-DD"),
        date_from: now.subtract(1, "month").date(27).format("YYYY-MM-DD")
    };
};