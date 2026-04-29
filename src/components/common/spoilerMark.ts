import { Mark, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spoiler: {
      toggleSpoiler: () => ReturnType;
    };
  }
}

/**
 * 스포일러 마크 — 선택한 텍스트를 가린 후 클릭 시 펼치는 SNS 패턴.
 * 에디터에선 늘 보이게 유지하되 data-spoiler 속성과 점선으로 표시.
 * 상세 페이지(viewer)에서 .spoiler-mark에 별도 CSS로 mask + click-to-reveal 처리.
 */
export const SpoilerMark = Mark.create({
  name: 'spoiler',

  inclusive: false,

  parseHTML() {
    return [{ tag: 'span[data-spoiler]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-spoiler': 'true',
        class: 'spoiler-mark',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleSpoiler:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    };
  },
});
