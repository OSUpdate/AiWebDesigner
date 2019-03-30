import asyncComponent from "../lib/asyncComponent";

export const Index = asyncComponent(() => import("./MainPage"));
export const Editor = asyncComponent(() => import("./WebEditorPage"));
export const Info = asyncComponent(() => import("./MyInfoPage"));
export const Select = asyncComponent(() => import("./SelectPage"));
export const NotFound = asyncComponent(() => import("./NotFoundPage"));
export const Forgot = asyncComponent(() => import("./ForgotPage"));