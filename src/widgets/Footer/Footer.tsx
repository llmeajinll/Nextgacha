import { footer, notice } from './footer.css';

// 약관·개인정보처리방침 대신 안내만 둔다 (docs/policies/members.md "약관·개인정보처리방침·사업자 정보")
export default function Footer() {
  return (
    <footer className={footer}>
      <p className={notice}>실제로 판매하지 않는 포트폴리오 사이트입니다.</p>
      <p>© NextGacha</p>
    </footer>
  );
}
