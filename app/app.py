import os
import sys

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)
from flask import Flask, render_template, request, session, redirect, url_for, flash
from random import *
import db
import json, urllib3, sys, os

my_app = Flask(__name__)
my_app.secret_key = os.urandom(64)

@my_app.route('/')
def root():
    return render_template("index.html")
@my_app.route('/about')
def about():
    return render_template("landing.html")
@my_app.route('/profile')
def profile():
    return render_template("profile.html")

"""
@my_app.route('/register')
def register():
    if 'user' in session:
        return redirect(url_for('root'))
    return render_template('register.html')

@my_app.route('/user_creation', methods=['POST'])
def user_creation():
    print("Trying USER")
    user = request.form['username']
    print("TRYING PW")
    pw = request.form['password']
    print("TRYING CONFIRM")
    pw_confirm = request.form['confirm']

    if db.look_for(user):
        flash ("Username already exists.")
        return redirect(url_for('register'))
    if pw != pw_confirm:
        flash ("Passwords do not match.")
        return redirect(url_for('register'))
    db.create_acc(user, pw)
    flash ("Account Created")
    return redirect(url_for('login'))

@my_app.route('/login', methods=['GET','POST'])
def login():
    if "user" in session:
        return redirect(url_for('root'))
    return render_template('login.html')

@my_app.route('/authenticate', methods=['GET','POST'])
def authenticate():
    user = request.form['username']
    pw = request.form['password']

    print ("[app] user is " + user)
    print ("[app] pw is " + pw)

    if db.look_for(user):
        #authenticate pass
        #print "hi"
        if db.authenticate(user, pw):
            session['user'] = user
            return redirect(url_for('root'))
        else:
            flash ("Incorrect Password.")
            return redirect(url_for('login'))
    else:
        flash ("User does not exist.")
        return redirect(url_for('login'))

@my_app.route('/logout', methods=['GET', 'POST'])
def logout():
    if "user" in session:
        username = session.pop('user')
        flash ("Logged out " + username)
        return redirect(url_for('login'))
    else:
        return redirect(url_for('root'))
"""