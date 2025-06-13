export interface CompareResultType {
  offline: {
    after1Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    after4Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    after12Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    after36Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    offlineTotalAmt: number;
    offlineTotalSuAmt: number;
  };
  online: {
    after1Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    after4Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    after12Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    after36Month: {
      debtSum: number;
      overdueSuamtSum: number;
      match: boolean;
    };
    onlineTotalAmt: number;
    onlineTotalSuAmt: number;
  };
};
