import * as s from './categoryManager.css';
import { MAX_LEN, type GroupKey } from './categoryKeys';

// 왼쪽: 대분류 목록 + 새 대분류 추가
export default function GroupPanel({
  groups,
  cur,
  total,
  onPick,
  newGroup,
  setNewGroup,
  addGroup,
  saving,
}: {
  groups: { key: GroupKey; name: string }[];
  cur: GroupKey;
  total: (key: GroupKey) => number;
  onPick: (key: GroupKey) => void;
  newGroup: string;
  setNewGroup: (v: string) => void;
  addGroup: () => void;
  saving: boolean;
}) {
  return (
    <section aria-label='대분류' className={s.groupPanel}>
      <div className={s.panelHead}>
        <h2 className={s.panelTitle}>대분류</h2>
        <span className={s.pixelCount}>{groups.length}</span>
      </div>
      <div className={s.groupList}>
        {groups.map((g) => (
          <button
            key={g.key}
            type='button'
            aria-pressed={g.key === cur}
            className={g.key === cur ? `${s.groupBtn} ${s.groupBtnActive}` : s.groupBtn}
            onClick={() => onPick(g.key)}
          >
            <span className={s.groupName}>{g.name}</span>
            <span className={s.groupCount}>{total(g.key)}</span>
          </button>
        ))}
      </div>
      <form
        className={s.groupFoot}
        onSubmit={(e) => {
          e.preventDefault();
          addGroup();
        }}
      >
        <div className={s.addRow}>
          <input
            type='text'
            value={newGroup}
            maxLength={MAX_LEN}
            onChange={(e) => setNewGroup(e.target.value)}
            aria-label='새 대분류 이름'
            placeholder='새 대분류'
            className={s.input}
          />
          <button type='submit' className={s.addBtnLine} disabled={saving}>
            ADD
          </button>
        </div>
      </form>
    </section>
  );
}
