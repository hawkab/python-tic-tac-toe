from django.conf.urls import patterns, include, url
from django.contrib import admin
from humans import views
from humans.views import MainPage
urlpatterns = patterns('',
                       url(r'^auth/$', 'humans.views.auth'),
                       url(r'^$', MainPage.as_view()),
                       url(r'^index', MainPage.as_view()),
                       url(r'^get_players/', 'humans.views.get_players'),
                       url(r'^invitation/', 'humans.views.invitation'),
                       url(r'^decide/', 'humans.views.decide'),
                       url(r'^exit/', 'humans.views.exit'),
                       url(r'^move/', 'humans.views.move'),
                       url(r'^paint/', 'humans.views.paint'),
                       url(r'^auth/exit/', 'humans.views.exit'),
                       url(r'^getmessages/', 'humans.views.get_messages'),
                       url(r'^sendmessage/', 'humans.views.set_message'),
                       )