FROM python
RUN pip3 install jupyterlab

COPY ./docker-cmd.sh /docker-cmd.sh
CMD ["/docker-cmd.sh"]
EXPOSE 80/tcp

COPY ./docker-healthcheck.sh /docker-healthcheck.sh
HEALTHCHECK --start-period=5s CMD ["/docker-healthcheck.sh"]
