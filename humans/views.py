from django.shortcuts import render_to_response, RequestContext, redirect
from django.http import HttpResponseBadRequest, HttpResponse
from django.views.generic import TemplateView
from .models import Human, HumanVals, Game, GameMove, GameChat
from .common_function import convert_datetime_to_string, clear_string
from .forms import SignUpForm

import json
import datetime

class MainPage(TemplateView):
    template_name = 'humans/index.html'

def check_win(board, win_at, x_count, y_count):
    max = x_count * y_count
    horizontal = 1
    vertical = 1
    diag1 = 1
    diag2 = 1

    for i in board:
        next_pos = i + 1
        num_row = round((float(i) / y_count)+0.45)
        cur_line = [l for l in board if num_row == round((float(l) / y_count)+0.45) ]
        if next_pos in board and next_pos <= max and next_pos in cur_line:
            horizontal += 1
            if horizontal == win_at:
                return True
        next_pos = i + x_count
        if next_pos in board and next_pos <= max:
            vertical += 1
            if vertical == win_at:
                return True
        next_pos = i + x_count - 1
        if next_pos in board and next_pos <= max:
            diag1 += 1
            if diag1 == win_at:
                return True
        next_pos = i + x_count + 1
        if next_pos in board and next_pos <= max:
            diag2 += 1
            if diag2 == win_at:
                return True
    return False

def exit(request):
    response = redirect('http://tik-tak-toe.djangohost.name/')
    if 'player' in request.COOKIES:
        player = request.COOKIES['player']
        response.delete_cookie('player')
        response.delete_cookie('nick')
        response.delete_cookie('lang')
        guys_go_out(player)
    return response


def get_active_humans():
    active = HumanVals.objects.filter(enable=True).order_by('-score')
    h_list = []
    for act in active:
        h = Human.objects.filter(id=act.human.id)[0]
        a = datetime.datetime.strptime(
            convert_datetime_to_string(
                act.updated), '%Y-%m-%dT%H:%M:%S')
        b = datetime.datetime.now()
        c = b - a
        if c.seconds > 900:
            guys_go_out(h.id)

        h_list.append({'nick': h.nick,
                       'pk': h.pk,
                       'score': act.score,
                       'updated': convert_datetime_to_string(act.updated),
                       'invated':
                           act.invated
                           if Game.objects.filter(second=h.pk, enable=True).exists()
                              or Game.objects.filter(first=h.pk, enable=True).exists()
                           else '',
                       'free': act.free,
                       'fails': act.fails,
                       'inGame': act.inGame})
    return h_list


def guys_go_out(player):
    if Human.objects.filter(id=player).exists():
        h = Human.objects.filter(id=player)[0]
        v = HumanVals.objects.filter(human=h)[0]
        g = Game()
        if Game.objects.filter(second=h.pk, enable=True).exists():
            g = Game.objects.filter(second=h.pk, enable=True)[0]
            hs = HumanVals.objects.filter(pk=g.first)[0]
        else:
            if Game.objects.filter(first=h.pk, enable=True).exists():
                g = Game.objects.filter(first=h.pk, enable=True)[0]
                hs = HumanVals.objects.filter(pk=g.second)[0]

        if not g.pk is None:
            hs.inGame = False
            hs.invated = ''
            hs.free = True
            hs.save()
            if GameChat.objects.filter(game=g).exists():
                gc = GameChat.objects.filter(game=g)
                gc.delete()

            g.delete()
        v.enable = False
        v.inGame = False
        v.invated = ''
        v.free = True
        v.save()


def paint(request):  # player
    req = (request.POST or None)
    if HumanVals.objects.filter(
            token=request.COOKIES['csrftoken'],
            enable=True).exists():
        inputPlayer = int(req['player'])
        g = Game()

        if Human.objects.filter(id=inputPlayer).exists():
            h = Human.objects.filter(id=inputPlayer)[0]

        if Game.objects.filter(second=h.pk, enable=True).exists():
            g = Game.objects.filter(second=h.pk, enable=True)[0]
        elif Game.objects.filter(first=h.pk, enable=True).exists():
            g = Game.objects.filter(first=h.pk, enable=True)[0]

        if not g.pk is None:
            countMoves = 1

            if GameMove.objects.filter(game=g.pk).exists():
                gameMove = GameMove.objects.filter(game=g.pk)
                m_list = []
                m_list.append(
                    {'X': [gm.place for gm in gameMove if (gm.move % 2 == 1)],
                     'O': [gm.place for gm in gameMove if (gm.move % 2 == 0)]}
                )

                countMoves = GameMove.objects.filter(game=g.pk).count() + 1

                if (countMoves % 2 == 1):
                    m_list.append(
                        {'move': Human.objects.filter(id=g.first)[0].nick})
                else:
                    m_list.append(
                        {'move': Human.objects.filter(id=g.second)[0].nick})

                if countMoves > 4:
                    moves = GameMove.objects.filter(game=g.pk, player=True)
                    win = check_win(sorted([i.place for i in moves]), 3, 3, 3)
                    winner = Human.objects.filter(id=g.first)[0].nick
                    if not win:
                        moves = GameMove.objects.filter(
                            game=g.pk, player=False)
                        win = check_win(
                            sorted([i.place for i in moves]), 3, 3, 3)
                        winner = Human.objects.filter(id=g.second)[0].nick
                else:
                    win = False

                m_list.append({'winner': winner if win else (
                    'friendship' if countMoves > 9 else 'none')})
                return HttpResponse(json.dumps(m_list))

            return HttpResponse(json.dumps(
                {'nodata': Human.objects.filter(id=g.first)[0].nick}))

        return HttpResponse(json.dumps({'status': 'gameover'}))

    else:
        return exit(request)


def move(request):  # player(nick), place(1-9)
    req = (request.POST or None)

    if HumanVals.objects.filter(
            token=request.COOKIES['csrftoken'],
            enable=True).exists():
        inputPlace = int(req['place'])
        responce = []
        g = Game()

        if Human.objects.filter(id=req['player']).exists():
            h = Human.objects.filter(id=req['player'])[0]

        if Game.objects.filter(second=h.pk, enable=True).exists():
            g = Game.objects.filter(second=h.pk, enable=True)[0]
            first = False

        elif Game.objects.filter(first=h.pk, enable=True).exists():
            g = Game.objects.filter(first=h.pk, enable=True)[0]
            first = True

        if not g.pk is None:
            responce.append({'first': g.first})

            if GameMove.objects.filter(game=g.pk, move=1).exists():
                countMoves = GameMove.objects.filter(game=g.pk).count() + 1

                if GameMove.objects.filter(
                        game=g.pk, place=inputPlace).exists():
                    responce.append({'status': 'busy'})
                    return HttpResponse(json.dumps(responce))
            else:
                countMoves = 1

            if (countMoves %
                2 == 1 and not first) or (countMoves %
                                          2 == 0 and first):
                responce.append({'status': 'strange move'})
                return HttpResponse(json.dumps(responce))

            newMove = GameMove(
                game=g,
                player=first,
                move=countMoves,
                place=inputPlace
            )
            newMove.save(force_insert=True)

            if countMoves > 4:
                moves = GameMove.objects.filter(game=g.pk, player=first)
                board = sorted([i.place for i in moves])
                win = check_win(board, 3, 3, 3)

                if win:
                    hvw = HumanVals.objects.filter(human=h)[0]
                    hvw.score += 1
                    hvw.save()
                    if first:
                        hvf = HumanVals.objects.filter(pk=g.second)[0]
                    else:
                        hvf = HumanVals.objects.filter(pk=g.first)[0]
                    hvf.fails += 1
                    hvf.save()
                    g.winner = h.pk
                    g.save()
            else:
                win = False

            responce.append({'status': 'win' if win else 'ok'})
            return HttpResponse(json.dumps(responce))

        else:
            responce.append({'status': 'gameover'})
            return HttpResponse(json.dumps(responce))

    else:
        return exit(request)


def get_players(request):
    if HumanVals.objects.filter(
            token=request.COOKIES['csrftoken'],
            enable=True).exists():
        return HttpResponse(json.dumps(get_active_humans()))
    else:
        return exit(request)


def invitation(request):
    req = (request.POST or None)
    if HumanVals.objects.filter(
            token=request.COOKIES['csrftoken'],
            enable=True).exists():
        who = HumanVals.objects.filter(human=req['who'])[0]
        inv = HumanVals.objects.filter(human=req['invite'])[0]

        if who.free and inv.free and inv.enable:
            who.free = False
            who.save()
            g = Game(first=req['who'], second=req['invite'], enable=True)
            g.save(force_insert=True)
            inv.invated = g.id
            inv.free = False
            inv.save()
            return HttpResponse('sended')
        else:
            return HttpResponse('busy')

    else:
        return exit(request)


def decide(request):
    req = (request.POST or None)
    if HumanVals.objects.filter(
            token=request.COOKIES['csrftoken'],
            enable=True).exists():
        if Human.objects.filter(id=req['second']).exists():
            h = Human.objects.filter(id=req['second'])[0]
        g = Game()

        if Game.objects.filter(second=h.pk, enable=True).exists():
            g = Game.objects.filter(second=h.pk, enable=True)[0]
        elif Game.objects.filter(first=h.pk, enable=True).exists():
            g = Game.objects.filter(first=h.pk, enable=True)[0]
        defaultGameId = 0

        if not g.pk is None:
            defaultGameId = g.pk
            hvs = HumanVals.objects.filter(pk=g.second)[0]
            hvf = HumanVals.objects.filter(pk=g.first)[0]
            hf = Human.objects.filter(id=hvf.pk)[0]

            if req['decide'] != 'wait':
                if req['decide'] == 'accept':
                    hvf.invated = g.id
                    hvf.inGame = True
                    hvs.inGame = True
                else:
                    if req['decide'] == 'decline':
                        if GameMove.objects.filter(game=g.pk).exists():
                            gm = GameMove.objects.filter(game=g.pk)
                            gm.delete()
                        if GameChat.objects.filter(game=g).exists():
                            gc = GameChat.objects.filter(game=g)
                            gc.delete()
                        if g.winner < 1:
                            hvs.declines += 1
                        hvf.free = True
                        hvs.free = True
                        hvf.inGame = False
                        hvs.inGame = False
                        hvs.invated = ''
                        hvf.invated = ''
                        g.delete()
            hvs.save()
            hvf.save()
        else:
            hv = HumanVals.objects.filter(pk=h.id)[0]
            hv.free = True
            hv.inGame = False
            hv.invated = ''
            hv.save()

        return HttpResponse(json.dumps(
            {'first': hf.nick, 'game': defaultGameId}))
    else:
        return exit(request)


def auth(request):
    form = SignUpForm(request.POST or None)

    response = HttpResponse(json.dumps(get_active_humans()))
    if form.is_valid():
        save_it = form.save(commit=False)
        save_it.nick = clear_string(save_it.nick).replace(' ', '')
        import hashlib
        save_it.passw = hashlib.sha224(save_it.passw).hexdigest()
        if not Human.objects.filter(nick__iexact=save_it.nick).exists():
            save_it.save()
        else:
            if not Human.objects.filter(passw=save_it.passw).exists():
                return HttpResponseBadRequest('Bad password')

        h = Human.objects.filter(
            passw=save_it.passw,
            nick__iexact=save_it.nick)[0]

        if not HumanVals.objects.filter(human=h.pk).exists():
            e = HumanVals(human=h,
                          score=0,
                          enable=True,
                          token=request.COOKIES['csrftoken'],
                          inGame=False)
            e.save(force_insert=True)
        else:
            v = HumanVals.objects.filter(human=h)[0]
            v.enable = True
            v.token = request.COOKIES['csrftoken']
            v.save()

        response = HttpResponse(json.dumps(get_active_humans()))
        response.set_cookie(
            'player',
            Human.objects.filter(
                passw=save_it.passw,
                nick__iexact=save_it.nick)[0].id)
        response.set_cookie('nick', save_it.nick)
    else:
        errors_dict = json.dumps(
            dict([(k, [e for e in v]) for k, v in form.errors.items()]))
        return HttpResponseBadRequest(json.dumps(errors_dict))
    return response


def get_messages(request):
    req = (request.POST or None)
    h = Human.objects.filter(pk=req['player'])[0]
    g = Game()

    if Game.objects.filter(second=h.pk, enable=True).exists():
        g = Game.objects.filter(second=h.pk, enable=True)[0]

    elif Game.objects.filter(first=h.pk, enable=True).exists():
        g = Game.objects.filter(first=h.pk, enable=True)[0]

    if GameChat.objects.filter(game=g.id).exists():
        messages = GameChat.objects.filter(game=g).order_by('id')
        ml = []
        for m in messages:
            ml.append({'id': m.id, 'message': m.message})

        response = HttpResponse(json.dumps(ml))
    else:
        response = HttpResponse('nodata')
    return response


def set_message(request):
    req = (request.POST or None)
    h = Human.objects.filter(pk=req['player'])[0]
    g = Game()

    if Game.objects.filter(second=h.pk, enable=True).exists():
        g = Game.objects.filter(second=h.pk, enable=True)[0]

    elif Game.objects.filter(first=h.pk, enable=True).exists():
        g = Game.objects.filter(first=h.pk, enable=True)[0]

    mess = req['message']
    m = GameChat(game=g, message=h.nick + ': ' + clear_string(mess))
    m.save()
    if GameChat.objects.filter(game=g).count() > 4:
        rem = GameChat.objects.filter(game=g).first()
        rem.delete()

    return HttpResponse(m.id)
