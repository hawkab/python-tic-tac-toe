from django.db import models
from django.utils.encoding import smart_unicode


class Human(models.Model):
    nick = models.CharField(max_length=30)
    passw = models.CharField(max_length=57)

    def is_active(self):
        return (HumanVals.objects.filter(human=self.pk)[0].enable)

    def __unicode__(self):
        return smart_unicode(self.nick)


class HumanVals(models.Model):
    human = models.ForeignKey(Human)
    score = models.IntegerField(default=0, null=False)
    fails = models.IntegerField(default=0, null=False)
    draw = models.IntegerField(default=0, null=False)
    declines = models.IntegerField(default=0, null=False)
    enable = models.BooleanField(default=1)
    updated = models.DateTimeField(auto_now=True)
    free = models.BooleanField(default=1)
    token = models.CharField(max_length=33)
    invated = models.CharField(max_length=30)
    inGame = models.BooleanField(default=0)

    def __unicode__(self):
        return smart_unicode(self.human)


class Game(models.Model):
    first = models.IntegerField(default=0, null=False)
    second = models.IntegerField(default=0, null=False)
    enable = models.BooleanField(default=0)
    winner = models.IntegerField(default=0, null=False)

    def __unicode__(self):
        return smart_unicode("True" if self.enable else "False")


class GameMove(models.Model):  # 1;True,1,9
    game = models.ForeignKey(Game)
    player = models.BooleanField(default=1)  # 1-first,0-second
    move = models.IntegerField(default=1, null=False)
    place = models.IntegerField(default=1, null=False)

    def __unicode__(self):
        return self.move


class GameChat(models.Model):
    game = models.ForeignKey(Game)
    message = models.CharField(max_length=57)

    def __unicode__(self):
        return smart_unicode(self.message)
