from django.conf.urls import patterns, include, url
from django.contrib import admin
import humans.urls

admin.autodiscover()

urlpatterns = patterns('',
   url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += humans.urls.urlpatterns