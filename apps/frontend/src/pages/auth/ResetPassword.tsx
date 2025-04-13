import { useParams } from "react-router-dom";
import { ResetPasswordForm } from "../../components/Auth/reset-password-form";

export default function ResetPasswordPage() {
  const { token } = useParams();

  if (!token) {
    window.location.href = "/login";
    return;
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
      <ResetPasswordForm token={token} />
    </div>
  );
}
