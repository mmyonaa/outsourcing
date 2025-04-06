// 유튜브 임베드
export const convertYoutubeToEmbedUrl = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
};
// 아폭 url 검증
export const isApocUrl = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?apoc\.day\/d\/([a-zA-Z0-9]{10})/;
  return regex.test(url) ? url : null;
};

export const setQuillIcon = async (Quill: any) => {
  const customIcons: any = Quill.import('ui/icons');
  customIcons.align[''] = '<img src="/assets/images/editor/icon/editor-icon_align_left.svg" alt="Left">';
  customIcons.align['center'] = '<img src="/assets/images/editor/icon/editor-icon_align_center.svg" alt="Center">';
  customIcons.align['right'] = '<img src="/assets/images/editor/icon/editor-icon_align_right.svg" alt="Right">';
  customIcons.align['justify'] = '<img src="/assets/images/editor/icon/editor-icon_align_justify.svg" alt="Justify">';

  customIcons.list['ordered'] = '<img src="/assets/images/editor/icon/editor-icon_list_number.svg" alt="Justify">';
  customIcons.list['bullet'] = '<img src="/assets/images/editor/icon/editor-icon_list_bullet.svg" alt="Justify">';
  customIcons.none = '<img src="/assets/images/editor/icon/editor-icon_list_none.svg" alt="Justify">';

  customIcons.bold = '<img src="/assets/images/editor/icon/editor-icon_text_bold.svg" alt="bold">';
  customIcons.italic = '<img src="/assets/images/editor/icon/editor-icon_text_italic.svg" alt="italic">';
  customIcons.underline = '<img src="/assets/images/editor/icon/editor-icon_text_underline.svg" alt="underline">';
  customIcons.strike = '<img src="/assets/images/editor/icon/editor-icon_text_strike.svg" alt="strike">';
  customIcons.blockquote = '<img src="/assets/images/editor/icon/editor-icon_quote.svg" alt="quote">';

  customIcons.link = '<img src="/assets/images/editor/icon/editor-icon_add_link.svg" alt="link">';
  customIcons.image = '<img src="/assets/images/editor/icon/editor-icon_picture.svg" alt="image">';
  customIcons.video = '<img src="/assets/images/editor/icon/editor-icon_movie.svg" alt="video">';

  customIcons.hr = '<img src="/assets/images/editor/icon/editor-icon_hr.svg" alt="hr">';
  return customIcons;
};
