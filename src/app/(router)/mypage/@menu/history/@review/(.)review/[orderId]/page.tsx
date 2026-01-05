import { ReviewModal } from '@/components/organisms';
import ModalPortal from '@/components/atoms/ModalPortal';

export default function page() {
  return (
    <ModalPortal>
      <ReviewModal />
    </ModalPortal>
  );
}
