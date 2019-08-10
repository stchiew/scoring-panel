declare interface IListFormStrings {
  SaveButtonText: string;
  LoadingFormIndicator: string;
  ErrorLoadingData: string;
  ItemLoadedSuccessfully: string;
  ItemSavedSuccessfully: string;
  FieldsErrorOnSaving: string;
  ErrorOnSavingListItem: string;
}

declare module 'ListFormStrings' {
  const strings: IListFormStrings;
  export = strings;
}