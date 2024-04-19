# Phaser bitmap font generator
a
用於產生 Phaser bitmapfont

參考至 https://github.com/stephanvermeire/phaser-bitmapfont-generator#readme

## start

```bash
	# 修改 generate-bitmapfont.js 中的 function ， 一次只可產生個字型 需要分次執行
	yarn start
```

## 安裝

- 安裝失敗參考資訊
  https://github.com/Automattic/node-canvas/issues/1065
  https://github.com/Automattic/node-canvas/issues/348

### Mac, Linux (Docker)

```bash
	yarn docker:build
	yarn docker:sh ## 進入 docker
	yarn install
	yarn start
```

### Windows Git Bash (Docker)

```bash
	docker rmi bitmapfont
	docker build -t bitmapfont .
	docker run --rm -it  -v $(pwd -W)://app bitmapfont sh
	yarn install
	yarn start
```

### MAC 不推薦

需要安裝 xcode command line tools

```bash
	xcode-select --install
```

安裝 node-canvas 依賴工具

```bash
	brew install pkgconfig
	brew install pixman
	brew install cairo
	brew install pango

	yarn install
	yarn start
```
