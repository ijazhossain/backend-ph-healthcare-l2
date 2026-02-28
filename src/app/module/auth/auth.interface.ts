export interface ILoginUserPayload{
    email:string;
    password:string;
}
export interface IRegistrationPatientPayload{
    name:string;
    email:string;
    password:string;
}
export interface IChangePasswordPayload{
    currentPassword:string;
    newPassword:string;
}