import Web3 from 'web3';

export const parseTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US').toString();
};

export const parseWeiToEth = (value: number): string => {
  const web3 = new Web3();
  const ethAmount = web3.utils.fromWei(value, 'ether');
  return ethAmount;
};
