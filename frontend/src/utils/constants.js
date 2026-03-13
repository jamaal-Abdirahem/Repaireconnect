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
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED:   "COMPLETED",
  PAID:        "PAID",
};

export const STATUS_META = {
  REPORTED:    { label: "Reported",    color: "yellow"  },
  ASSIGNED:    { label: "Assigned",    color: "blue"    },
  IN_PROGRESS: { label: "In Progress", color: "indigo"  },
  COMPLETED:   { label: "Completed",   color: "orange"  },
  PAID:        { label: "Paid",        color: "green"   },
};

export const TRACKER_STEPS = [
  { key: "REPORTED",    label: "Reported"    },
  { key: "ASSIGNED",    label: "Assigned"    },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED",   label: "Complete"    },
  { key: "PAID",        label: "Paid"        },
];
