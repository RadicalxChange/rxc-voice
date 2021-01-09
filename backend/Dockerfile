FROM python:3
ENV PYTHONUNBUFFERED 1

RUN mkdir /backend
COPY backend/QVtoolapi/ /backend

WORKDIR /backend

RUN pip install -r requirements.txt

ADD . /backend/
EXPOSE 8000
