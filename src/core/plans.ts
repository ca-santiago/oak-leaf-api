
type PlanType = "basic" | "advanced" | "total";

interface PlanDefinition {
  type: PlanType;
  maxHabits: number;
  currency: string;
  cost: number;
}

type Plans = {
  [key in PlanType]: PlanDefinition;
}

// Initial plan for everyone
const Basic: PlanDefinition = {
  type: "basic",
  maxHabits: 10,
  cost: 0,
  currency: "USD",
};

// Mainly used for people who share the app with others and those who
// use the sharedCode
const Advance: PlanDefinition = {
  type: "advanced",
  maxHabits: 20,
  cost: 10,
  currency: "USD",
};

const Total: PlanDefinition = {
  type: "total",
  maxHabits: 99999,
  cost: 15,
  currency: "USD",
};

export const PLANS: Plans = {
  basic: Basic,
  total: Total,
  advanced: Advance,
};
