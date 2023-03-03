From node:16-alpine3.16


WORKDIR /app

# node-gyp 依賴
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk add make g++ linux-headers

# canvas 依賴
RUN apk add --update --no-cache  pkgconfig
RUN apk add pixman-dev cairo-dev pango-dev jpeg-dev giflib-dev