/** utils/constants.js */

export const ROLES = {
  CLIENT:     "CLIENT",
  TECHNICIAN: "TECHNICIAN",
  OPERATOR:   "OPERATOR",
  ADMIN:      "ADMIN",
};

export const REQUEST_STATUS = {
  REPORTED:    "REPORTED",
  ASSIGNED:    "ASSIGNED",
  ARRIVED:     "ARRIVED",
  ESTIMATED:   "ESTIMATED",
  APPROVED:    "APPROVED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED:   "COMPLETED",
  PAID:        "PAID",
};

export const STATUS_META = {
  REPORTED:    { label: "Reported",    color: "brand" },
  ASSIGNED:    { label: "Assigned",    color: "brand" },
  ARRIVED:     { label: "Arrived",     color: "brand" },
  ESTIMATED:   { label: "Estimated",   color: "brand" },
  APPROVED:    { label: "Approved",    color: "brand" },
  IN_PROGRESS: { label: "In Progress", color: "brand" },
  COMPLETED:   { label: "Completed",   color: "brand" },
  PAID:        { label: "Paid",        color: "brand" },
};

export const TRACKER_STEPS = [
  { key: "REPORTED",    label: "Reported"    },
  { key: "ASSIGNED",    label: "Assigned"    },
  { key: "ARRIVED",     label: "Arrived"     },
  { key: "ESTIMATED",   label: "Estimated"   },
  { key: "APPROVED",    label: "Approved"    },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED",   label: "Complete"    },
  { key: "PAID",        label: "Paid"        },
];
