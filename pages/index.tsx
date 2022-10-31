import Link from "next/link";
import SignIn from "../components/auth/SignIn";
import "../core/i18n";

export default function Home() {
  return (<>
    메인페이지
    <br/>
    <Link href="/auth/signin">
      로그인페이지
    </Link>
  </>)
}