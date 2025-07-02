interface CountResponseItem {
  name: string;
  rows: number;
}

interface DetailSumResponseItem {
  name: string;
  amt: number;
  receiveAmt: number;
}

export interface DetailSumData {
  countResponse: CountResponseItem[];
  detailSumResponse: DetailSumResponseItem[];
}