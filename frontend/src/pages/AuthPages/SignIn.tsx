import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In | Daily Mart"
        description="Daily Mart admin sign in"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
