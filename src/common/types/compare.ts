export interface CompareResultType {
  offline: {
    after1Month: {
      collectionSum: number;
      reconcileSum: number;
      match: boolean;
    };
    after4Month: {
      collectionSum: number;
    };
    after12Month: {
      collectionSum: number;
    };
    after36Month: {
      collectionSum: number;
    };
  };
  online: {
    after1Month: {
      collectionSum: number;
      reconcileSum: number;
      match: boolean;
    };
    after4Month: {
      collectionSum: number;
    };
    after12Month: {
      collectionSum: number;
    };
    after36Month: {
      collectionSum: number;
    };
  };
};
