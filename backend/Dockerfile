ARG PYTHON_VERSION=3-slim

FROM python:${PYTHON_VERSION} as deps
ENV PYTHONUNBUFFERED 1

RUN mkdir /wheels
COPY backend/RxcVoiceApi/requirements.txt /wheels/
WORKDIR /wheels
RUN pip install -U pip \
   && pip wheel -r requirements.txt

FROM python:${PYTHON_VERSION} as builder
ENV PYTHONUNBUFFERED 1

COPY --from=deps /wheels /wheels
RUN pip install -U pip \
      && pip install --no-cache-dir \
                     -r /wheels/requirements.txt \
                     -f /wheels \
      && rm -rf /wheels \

WORKDIR /backend
COPY ./backend/RxcVoiceApi/ /backend

EXPOSE 8000
