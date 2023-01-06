/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface HackformsEscrowInterface extends utils.Interface {
  functions: {
    "balance()": FunctionFragment;
    "balanceOfDeal(string)": FunctionFragment;
    "disburseFund(string,uint256,address[])": FunctionFragment;
    "fundDeal(string)": FunctionFragment;
    "hasEnoughBalance(string,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "balance"
      | "balanceOfDeal"
      | "disburseFund"
      | "fundDeal"
      | "hasEnoughBalance"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "balance", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceOfDeal",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "disburseFund",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "fundDeal",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "hasEnoughBalance",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "balance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfDeal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "disburseFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fundDeal", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasEnoughBalance",
    data: BytesLike
  ): Result;

  events: {
    "Deposit(address,string,uint256,uint256)": EventFragment;
    "HackformsDealCreated(address,string,uint256)": EventFragment;
    "PaymentDisbursed(address,string,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "HackformsDealCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PaymentDisbursed"): EventFragment;
}

export interface DepositEventObject {
  _from: string;
  formId: string;
  amount: BigNumber;
  timestamp: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface HackformsDealCreatedEventObject {
  _from: string;
  formId: string;
  timestamp: BigNumber;
}
export type HackformsDealCreatedEvent = TypedEvent<
  [string, string, BigNumber],
  HackformsDealCreatedEventObject
>;

export type HackformsDealCreatedEventFilter =
  TypedEventFilter<HackformsDealCreatedEvent>;

export interface PaymentDisbursedEventObject {
  to: string;
  formId: string;
  amount: BigNumber;
  timestamp: BigNumber;
}
export type PaymentDisbursedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  PaymentDisbursedEventObject
>;

export type PaymentDisbursedEventFilter =
  TypedEventFilter<PaymentDisbursedEvent>;

export interface HackformsEscrow extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HackformsEscrowInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balance(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceOfDeal(
      formId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    disburseFund(
      formId: PromiseOrValue<string>,
      rate: PromiseOrValue<BigNumberish>,
      recps: PromiseOrValue<string>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    fundDeal(
      formId: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hasEnoughBalance(
      formId: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  balance(overrides?: CallOverrides): Promise<BigNumber>;

  balanceOfDeal(
    formId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  disburseFund(
    formId: PromiseOrValue<string>,
    rate: PromiseOrValue<BigNumberish>,
    recps: PromiseOrValue<string>[],
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  fundDeal(
    formId: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hasEnoughBalance(
    formId: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    balance(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfDeal(
      formId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    disburseFund(
      formId: PromiseOrValue<string>,
      rate: PromiseOrValue<BigNumberish>,
      recps: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    fundDeal(
      formId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    hasEnoughBalance(
      formId: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "Deposit(address,string,uint256,uint256)"(
      _from?: PromiseOrValue<string> | null,
      formId?: PromiseOrValue<string> | null,
      amount?: null,
      timestamp?: null
    ): DepositEventFilter;
    Deposit(
      _from?: PromiseOrValue<string> | null,
      formId?: PromiseOrValue<string> | null,
      amount?: null,
      timestamp?: null
    ): DepositEventFilter;

    "HackformsDealCreated(address,string,uint256)"(
      _from?: PromiseOrValue<string> | null,
      formId?: PromiseOrValue<string> | null,
      timestamp?: null
    ): HackformsDealCreatedEventFilter;
    HackformsDealCreated(
      _from?: PromiseOrValue<string> | null,
      formId?: PromiseOrValue<string> | null,
      timestamp?: null
    ): HackformsDealCreatedEventFilter;

    "PaymentDisbursed(address,string,uint256,uint256)"(
      to?: PromiseOrValue<string> | null,
      formId?: PromiseOrValue<string> | null,
      amount?: null,
      timestamp?: null
    ): PaymentDisbursedEventFilter;
    PaymentDisbursed(
      to?: PromiseOrValue<string> | null,
      formId?: PromiseOrValue<string> | null,
      amount?: null,
      timestamp?: null
    ): PaymentDisbursedEventFilter;
  };

  estimateGas: {
    balance(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOfDeal(
      formId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    disburseFund(
      formId: PromiseOrValue<string>,
      rate: PromiseOrValue<BigNumberish>,
      recps: PromiseOrValue<string>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    fundDeal(
      formId: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hasEnoughBalance(
      formId: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOfDeal(
      formId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    disburseFund(
      formId: PromiseOrValue<string>,
      rate: PromiseOrValue<BigNumberish>,
      recps: PromiseOrValue<string>[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    fundDeal(
      formId: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hasEnoughBalance(
      formId: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
