# Prism-vrc

> Prism은 VRC 맵 제작 패러다임을 바꿀 라이브러리입니다.
> 

# 서론

기존의 VRC에서는 VideoPlayer를 통해 서버와 통신하는 것이 유일한 외부와의 커뮤니케이션 방법이었습니다.

저희는 여기서 아이디어를 얻어, 첫 번째 프로젝트인 [IMOStream](https://github.com/kibalab/IMOStream)을 만들게 됩니다. 간단한 설명을 덧붙이자면, 이미지 파일을 url에 맞게 보내줄 수 있는 서버입니다.

여기서 더 나아가, 저희는 이미지 뿐만이 아닌 텍스트를 보내는 방법을 찾아냈고, QR코드와 비슷하게 바이너리 데이터를 이미지로 표시해 VRC에 보내고, 이 이미지를 디코딩하여 텍스트 데이터를 얻을 수 있었습니다.

# 설치

```bash
npm install prism-vrc

or

yarn add prism-vrc
```

# 사용법

express 기준

```tsx
import Prism from "prism-vrc";

app.get('/', async (req, res) => {
	res.writeHead(200, { 'Content-Type': 'video/mp4' });
	res.end(await Prism("Hello, world!"));
});
```

# 예제

[prism-server-example](https://github.com/SieR-VR/prism-server-example)