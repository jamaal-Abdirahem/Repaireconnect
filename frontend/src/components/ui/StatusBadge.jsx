/** components/ui/StatusBadge.jsx */
import { Badge } from "./Badge.jsx";
import { STATUS_META } from "../../utils/constants.js";

export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: "gray" };
  return <Badge color={meta.color}>{meta.label}</Badge>;
}
