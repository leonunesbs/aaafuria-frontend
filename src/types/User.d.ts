export type UserData = {
  id: string;
  isStaff: boolean;
  member: {
    id: string;
    registration: string;
    name: string;
    nickname: string;
    group: string;
    email: string;
    avatar: string;
    birthDate: string;
    rg: string;
    cpf: string;
    blogCoins: number;
    hasActiveMembership: boolean;
    isFirstTeamer: boolean;
    isCoordinator: boolean;
    activeMembership: {
      membershipPlan: {
        title: string;
      };
      startDate: string;
      currentEndDate: string;
    } | null;
  };
};
