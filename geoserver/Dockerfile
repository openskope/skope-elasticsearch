FROM winsent/geoserver:2.12.0
MAINTAINER Jeff Terstriep <jefft@illnois.edu>

ENV GEOSERVER_VERSION 2.12.0

# Get imagepyramid plugin
#https://svwh.dl.sourceforge.net/project/geoserver/GeoServer/2.9.3/extensions/geoserver-2.9.3-pyramid-plugin.zip
RUN wget -c https://downloads.sourceforge.net/project/geoserver/GeoServer/$GEOSERVER_VERSION/extensions/geoserver-$GEOSERVER_VERSION-pyramid-plugin.zip -O ~/geoserver-pyramid-plugin.zip && \
    unzip -o ~/geoserver-pyramid-plugin.zip -d /opt/geoserver/webapps/geoserver/WEB-INF/lib/ && \
    rm ~/geoserver-pyramid-plugin.zip

RUN wget -c https://downloads.sourceforge.net/project/geoserver/GeoServer/$GEOSERVER_VERSION/extensions/geoserver-$GEOSERVER_VERSION-imagemosaic-jdbc-plugin.zip -O ~/geoserver-imagemosaic-jdbc-plugin.zip && \
    unzip -o ~/geoserver-imagemosaic-jdbc-plugin.zip -d /opt/geoserver/webapps/geoserver/WEB-INF/lib/ && \
    rm ~/geoserver-imagemosaic-jdbc-plugin.zip

USER 0:1258
