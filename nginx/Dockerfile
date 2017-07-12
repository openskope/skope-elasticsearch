FROM nginx
MAINTAINER Jeff Terstriep <jefft@illinois.edu>

RUN addgroup --gid 1258 prj_cg_skope && adduser nginx prj_cg_skope
COPY nginx.conf /etc/nginx
RUN mkdir -p /var/lib/nginx/cache && chown nginx /var/lib/nginx/cache

