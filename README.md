## Nova Skin

Nova는 the tree용 Liberty 스킨의 Vue 구조를 기반으로 만든 위키 스킨입니다.

Liberty의 레이아웃, 문서 도구, 검색 폼, 설정 모달, 로고 설정, 최근 활동 사이드바 구조를 유지하면서 Nova 전용 레이아웃과 색상 레이어를 `css/nova.css`에서 적용합니다. 위키 본문 내부 스타일은 자체적으로 덮어쓰지 않고 위키의 CSS를 사용합니다.

## 설정 키

### 로고

- `skin.nova.navbar_logo_text`
- `skin.nova.navbar_logo_image`
- `skin.nova.navbar_logo_minimum_width`
- `skin.nova.navbar_logo_width`
- `skin.nova.navbar_logo_size`
- `skin.nova.navbar_logo_padding`
- `skin.nova.navbar_logo_margin`

### 색상 / 테마

- `skin.nova.brand_color_1`
- `skin.nova.brand_dark_color_1`
- `skin.nova.brand_bright_color_1`
- `skin.nova.brand_color_2`
- `skin.nova.brand_bright_color_2`
- `skin.nova.accent_color`
- `skin.nova.warm_color`
- `skin.nova.background_color`
- `skin.nova.dark_background_color`
- `skin.nova.surface_color`
- `skin.nova.dark_surface_color`
- `skin.nova.surface_soft_color`
- `skin.nova.dark_surface_soft_color`
- `skin.nova.border_color`
- `skin.nova.dark_border_color`
- `skin.nova.text_color`
- `skin.nova.dark_text_color`
- `skin.nova.muted_color`
- `skin.nova.dark_muted_color`
- `skin.nova.article_background_color`
- `skin.nova.dark_article_background_color`

### 기타

- `skin.nova.footer_html`
- `nova.sidebar`
- `nova.fixed_navbar`
- `nova.reset_search_on_move`
- `nova.admin_convenience`

기존 Liberty 설정 키도 fallback으로 읽습니다. 사용자 설정은 사이드바가 아니라 위키 설정 모달을 사용합니다.

## 원작

- [Liberty Skin](https://github.com/librewiki/liberty-skin)
- [thetree-skin-liberty](https://github.com/wjdgustn/thetree-skin-liberty)
