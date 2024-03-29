"use strict";
var view = function() {
    var e = {},
        t = {},
        i, n, o, r, a, d, s, c, l, u, f, p;
    i = function(e) {
        if (e !== undefined) {
            t.dfb = e
        }
        return t.dfb
    };
    e.dfb = i;
    n = function(e) {
        d3.select("#working_icon").classed("invisible", !e)
    };
    e.loading = n;
    o = function(e, t) {
        d3.select("#working_icon").classed("invisible", !t);
        d3.selectAll(e + " .calc").classed("hidden", !t);
        d3.selectAll(e + " .calc-done").classed("hidden", t)
    };
    e.calculating = o;
    r = function(e) {
        d3.select("div#error").classed("hidden", false).append("p").text(e);
        this.loading(false);
        VIS.error = true
    };
    e.error = r;
    a = function(e) {
        d3.select("div#warning").classed("hidden", false).append("p").text(e)
    };
    e.warning = a;
    d = function() {
        var e = t.tooltip;
        if (e) {
            return e
        }
        e = {
            offset: VIS.tooltip.offset
        };
        e.div = d3.select("body").append("div").attr("id", "tooltip").classed("bar_tooltip", true);
        e.container = d3.select("body").node();
        e.div.append("p");
        e.update_pos = function() {
            var e = d3.mouse(this.container);
            this.div.style({
                left: e[0] + this.offset.x + "px",
                top: e[1] + this.offset.y + "px",
                position: "absolute"
            })
        };
        e.text = function(e) {
            this.div.select("p").text(e)
        };
        e.show = function() {
            this.div.classed("hidden", false)
        };
        e.hide = function() {
            this.div.classed("hidden", true)
        };
        t.tooltip = e;
        return e
    };
    e.tooltip = d;
    s = function(e) {
        if (e.title) {
            d3.selectAll(".model_title").html(e.title)
        }
    };
    e.frame = s;
    c = function(e) {
        if (e.w) {
            e.enter.append("td").classed("weight", true).append("div").classed("proportion", true).append("span").classed("proportion", true).html("&nbsp;");
            e.sel.select("td.weight div.proportion").style("margin-left", function(t) {
                return d3.format(".1%")(1 - e.w(t))
            })
        }
        if (e.frac) {
            e.enter.append("td").classed("td-right", true).classed("weight-percent", true);
            e.sel.select("td.weight-percent").text(e.frac)
        }
        if (e.raw) {
            e.enter.append("td").classed("td-right", true).classed("weight-raw", true);
            e.sel.select("td.weight-raw").text(e.raw)
        }
    };
    e.weight_tds = c;
    l = function(e, t) {
        var i;
        if (!VIS.svg) {
            VIS.svg = d3.map()
        }
        if (VIS.svg.has(e)) {
            i = VIS.svg.get(e);
            d3.select(e + " svg").attr("width", t.w + t.m.left + t.m.right).attr("height", t.h + t.m.top + t.m.bottom);
            i.attr("transform", "translate(" + t.m.left + "," + t.m.top + ")")
        } else {
            i = u(d3.select(e), t);
            VIS.svg.set(e, i)
        }
        return i
    };
    e.plot_svg = l;
    u = function(e, t) {
        return e.append("svg").attr("width", t.w + t.m.left + t.m.right).attr("height", t.h + t.m.top + t.m.bottom).append("g").attr("transform", "translate(" + t.m.left + "," + t.m.top + ")")
    };
    e.append_svg = u;
    f = function() {
        window.scrollTo(window.scrollX, 0)
    };
    e.scroll_top = f;
    p = function() {
        window.scrollTo(0, 0)
    };
    e.scroll_origin = p;
    return e
}();
"use strict";
var metadata = function(e) {
    var t = e || {},
        i = {},
        n, o, r, a, d, s;
    t.conditionals = d3.map(t.conditionals);
    n = function(e) {
        if (typeof e !== "string") {
            return
        }
        t.docs = d3.csv.parse(e);
        if (t.date_field && t.docs[0].hasOwnProperty(t.date_field)) {
            t.docs.forEach(function(e) {
                e[t.date_field] = new Date(e[t.date_field])
            })
        }
    };
    i.from_string = n;
    o = function(e) {
        if (typeof e === "string") {
            t.date_field = e;
            return this
        }
        return t.date_field
    };
    i.date_field = o;
    r = function(e) {
        if (isFinite(e)) {
            return t.docs[e]
        }
        if (e === undefined) {
            return t.docs
        }
        return e.map(function(e) {
            return t.docs[e]
        })
    };
    i.doc = r;
    a = function() {
        if (t.docs) {
            return t.docs.length
        }
    };
    i.n_docs = a;
    s = function() {
        return t.conditionals
    };
    i.conditionals = s;
    d = function(e, i, n) {
        if (i === undefined) {
            return t.conditionals.get(e)
        }
        t.conditionals.set(e, i(n, t.docs));
        return this
    };
    i.condition = d;
    return i
};
metadata.key = {
    ordinal: function(e, t) {
        var i = function(t) {
            return t[e.field].replace(/\s/g, "_")
        };
        i.invert = function(e) {
            return e.replace(/_/g, " ")
        };
        i.display = i.invert;
        i.range = d3.set(t.map(i)).values();
        i.range.sort();
        return i
    },
    continuous: function(e, t) {
        var i = d3.extent(t, function(t) {
                return +t[e.field]
            }),
            n, o, r, a;
        i[0] = Math.floor(i[0] / e.step) * e.step;
        n = Math.floor(Math.log10(e.step));
        o = Math.ceil(Math.log10(d3.max(i, Math.abs)));
        if (o >= 1) {
            if (n <= 0) {
                r = d3.format("0" + String(o + Math.abs(n) + 1) + "." + String(Math.abs(n)) + "f")
            } else {
                r = d3.format("0" + String(o) + ".0f")
            }
        } else {
            r = d3.format("." + String(Math.abs(n)) + "f")
        }
        a = function(t) {
            var n = i[0] + Math.floor((+t[e.field] - i[0]) / e.step) * e.step;
            return r(n)
        };
        a.invert = function(e) {
            return +e
        };
        a.display = function(t) {
            return String(+t) + "–" + String(+t + e.step)
        };
        a.range = d3.range(Math.floor((i[1] - i[0]) / e.step)).map(function(t) {
            return r(i[0] + t * e.step)
        });
        return a
    },
    time: function(e, t) {
        var i = d3.extent(t, function(t) {
                return t[e.field]
            }),
            n, o, r, a, d, s, c, l = e.n || 1,
            u = d3.time[e.unit].utc;
        n = [i[0]];
        o = u.offset(i[0], l);
        while (o < i[1]) {
            n.push(o);
            o = u.offset(o, l)
        }
        r = function(e) {
            return n[d3.bisect(n, e) - 1]
        };
        switch (e.unit) {
            case "year":
                s = "%Y";
                break;
            case "month":
                s = "%Y-%m";
                break;
            case "day":
                s = "%Y-%m-%d";
                break;
            case "hour":
                s = "%Y-%m-%d %H:00";
                break;
            case "minute":
                s = "%Y-%m-%d %H:%M";
                break;
            case "second":
                s = "%Y-%m-%d %H:%M:%S";
                break;
            default:
                r = function(e) {
                    return new Date(+i[0] + Math.floor((+e - +i[0]) / l) * l)
                };
                s = "%Y-%m-%dT%H:%M:%S.%LZ";
                break
        }
        a = d3.time.format.utc(s);
        if (l === 1) {
            d = function(t) {
                return a(t[e.field])
            }
        } else {
            d = function(t) {
                return a(r(t[e.field]))
            }
        }
        d.invert = function(e) {
            return a.parse(e)
        };
        if (e.format) {
            c = function(t) {
                return d3.time.format.utc(e.format)(a.parse(t))
            }
        } else {
            c = function(e) {
                return e
            }
        }
        if (l === 1) {
            d.display = function(e) {
                return c(e)
            }
        } else {
            d.display = function(e) {
                return c(e) + "–" + c(a(u.offset(a.parse(e), l)))
            }
        }
        d.range = n.map(r).map(a);
        return d
    }
};
"use strict";
var bib = function(e) {
    var t = e || {},
        i = {},
        n, o, r, a;
    if (!t.sorting) {
        t.sorting = [
            ["all_raw", "by raw entry"]
        ]
    }
    n = function(e) {
        if (e !== undefined) {
            t.sorting = e
        }
        return t.sorting
    };
    i.sorting = n;
    i.keys = {};
    i.keys.all = function() {
        return "All"
    };
    i.keys.raw = function(e) {
        return JSON.stringify(e)
    };
    o = function(e) {
        var t = [],
            n, o = e.dir.major ? d3.ascending : d3.descending,
            r = e.dir.minor ? d3.ascending : d3.descending,
            a = function(e) {
                return e.id
            },
            d, s, c, l = [];
        n = e.docs.map(function(t, n) {
            return {
                id: n,
                major: i.keys[e.major](t),
                minor: i.keys[e.minor](t)
            }
        }).sort(function(e, t) {
            return o(e.major, t.major) || r(e.minor, t.minor) || d3.ascending(e.id, t.id)
        });
        for (s = 0, d = ""; s < n.length; s += 1) {
            if (n[s].major !== d) {
                l.push(s);
                t.push({
                    heading: n[s].major
                });
                d = n[s].major
            }
        }
        l.shift();
        l.push(n.length);
        for (s = 0, c = 0; s < l.length; s += 1) {
            t[s].docs = n.slice(c, l[s]).map(a);
            c = l[s]
        }
        if (typeof i.keys[e.major].display_heading === "function") {
            t.forEach(function(t) {
                t.heading_display = i.keys[e.major].display_heading(t.heading)
            })
        }
        return t
    };
    i.sort = o;
    o.validate = function(e) {
        var i = t.sorting.map(function(e) {
                return e[0].split("_")[0]
            }),
            n = t.sorting.map(function(e) {
                return e[0].split("_")[1]
            }),
            o = e;
        if (i.indexOf(e.major) === -1) {
            o.major = undefined
        }
        if (n.indexOf(e.minor) === -1) {
            o.minor = undefined
        }
        if (e.dir !== "up" && e.dir !== "down") {
            o.dir = undefined
        }
        return o
    };
    o.dir = function(e) {
        return {
            major: e.dir !== "down",
            minor: true
        }
    };
    r = function(e) {
        return JSON.stringify(e)
    };
    i.citation = r;
    a = function() {
        return ""
    };
    i.url = a;
    return i
};
"use strict";
var VIS = {
    last: {
        bib: {}
    },
    files: {
        info: "data/info.json",
        meta: "data/meta.csv.zip",
        dt: "data/dt.json.zip",
        tw: "data/tw.json",
        topic_scaled: "data/topic_scaled.csv"
    },
    aliases: {
        yearly: "conditional"
    },
    default_view: "/model",
    metadata: {
        type: "dfr",
        spec: {
            extra_fields: [],
            date_field: "date"
        }
    },
    condition: {
        type: "time",
        spec: {
            field: "date",
            unit: "year",
            n: 1
        }
    },
    overview_words: 15,
    model_view: {
        plot: {
            w: 500,
            aspect: 1.3333,
            words: 6,
            size_range: [7, 18],
            name_size: 18,
            stroke_range: 6
        },
        conditional: {
            w: 500,
            aspect: 1.333,
            m: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 30
            },
            label_threshold: 40,
            words: 4,
            label_words: 2,
            streamgraph: true,
            ordinal: {
                bar: .4
            }
        },
        list: {
            spark: {
                w: 70,
                h: 20,
                m: {
                    left: 2,
                    right: 2,
                    top: 2,
                    bottom: 2
                },
                time: {
                    bar: {
                        unit: "day",
                        w: 300
                    }
                },
                ordinal: {
                    bar: {
                        w: .25
                    }
                },
                continuous: {
                    bar: {
                        w: .25
                    }
                }
            }
        }
    },
    topic_view: {
        words: 50,
        docs: 20,
        w: 400,
        aspect: 3,
        m: {
            left: 40,
            right: 20,
            top: 20,
            bottom: 30
        },
        time: {
            bar: {
                unit: "day",
                w: 90
            },
            ticks: 10
        },
        continuous: {
            bar: {
                w: .25
            },
            ticks: 10
        },
        ordinal: {
            bar: {
                w: .25
            },
            ticks: 10
        },
        ticks_y: 10,
        tx_duration: 1e3
    },
    word_view: {
        n_min: 10,
        topic_label_padding: 8,
        topic_label_leading: 14,
        row_height: 80,
        svg_rows: 10,
        w: 700,
        m: {
            left: 100,
            right: 40,
            top: 20,
            bottom: 0
        }
    },
    bib: {
        author_delimiter: "	",
        et_al: Infinity,
        anon: "[Anon]"
    },
    bib_view: {
        window_lines: 100,
        major: "year",
        minor: "authortitle",
        dir: "up"
    },
    tooltip: {
        offset: {
            x: 10,
            y: 0
        }
    },
    percent_format: d3.format(".1%"),
    resize_refresh_delay: 100,
    hidden_topics: [],
    show_hidden_topics: false,
    annotes: [],
    update: function(e) {
        return utils.deep_replace(this, e)
    }
};
"use strict";
var model;
model = function(e) {
    var t = e || {},
        i = {},
        n, o, r, a, d, s, c, l, u, f, p, m, w, _, v, h, g, b, y, x, k, S, I, V, A, j;
    t.ready = {};
    t.worker = new Worker("js/worker.min.js");
    t.worker.fs = d3.map();
    t.worker.onmessage = function(e) {
        var i = t.worker.fs.get(e.data.what);
        if (i) {
            i(e.data.result)
        }
    };
    t.worker.callback = function(e, i) {
        t.worker.fs.set(e, i)
    };
    n = function(e) {
        if (e) {
            t.info = e
        }
        return t.info
    };
    i.info = n;
    o = function() {
        var e;
        if (t.n_docs !== undefined) {
            e = t.n_docs
        } else if (t.meta) {
            e = t.meta.n_docs()
        }
        return e
    };
    i.n_docs = o;
    r = function() {
        return !!t.ready.dt
    };
    i.has_dt = r;
    a = function(e, i) {
        if (!t.tw) {
            return undefined
        }
        if (e === undefined) {
            return t.tw
        }
        if (i === undefined) {
            return t.tw[e]
        }
        return t.tw[e].get(i)
    };
    i.tw = a;
    d = function() {
        return t.n
    };
    i.n = d;
    s = function() {
        if (!this.tw()) {
            return undefined
        }
        return t.tw[0].keys().length
    };
    i.n_top_words = s;
    c = function(e) {
        if (!t.total_tokens) {
            t.worker.callback("total_tokens", function(i) {
                t.total_tokens = i;
                e(i)
            });
            t.worker.postMessage({
                what: "total_tokens"
            })
        } else {
            e(t.total_tokens)
        }
    };
    i.total_tokens = c;
    l = function(e, i) {
        var n = isFinite(e) ? e : "all";
        t.worker.callback("topic_total/" + n, i);
        t.worker.postMessage({
            what: "topic_total",
            t: n
        })
    };
    i.topic_total = l;
    u = function(e) {
        if (!t.alpha) {
            return undefined
        }
        return isFinite(e) ? t.alpha[e] : t.alpha
    };
    i.alpha = u;
    f = function(e) {
        if (!t.meta) {
            return undefined
        }
        return t.meta.doc(e)
    };
    i.meta = f;
    p = function(e) {
        return t.meta.condition(e)
    };
    i.meta_condition = p;
    m = function(e) {
        var t = d3.set(),
            n;
        if (!a()) {
            return undefined
        }
        if (isFinite(e)) {
            a(e).keys().forEach(t.add)
        } else {
            if (e === undefined) {
                n = a()
            } else {
                n = e.map(function(e) {
                    return i.tw(e)
                })
            }
            n.forEach(function(e) {
                e.keys().forEach(function(e) {
                    t.add(e)
                })
            })
        }
        return t.values().sort()
    };
    i.vocab = m;
    w = function(e) {
        if (!t.topic_scaled) {
            return undefined
        }
        if (e === undefined) {
            return t.topic_scaled
        }
        return t.topic_scaled[e]
    };
    i.topic_scaled = w;
    v = function(e, i, n) {
        var o = i === undefined ? "all" : i,
            r = o !== "all" ? n : function(e) {
                n(d3.map(e))
            };
        t.worker.callback("conditional_total/" + e + "/" + o, r);
        t.worker.postMessage({
            what: "conditional_total",
            v: e,
            key: o
        })
    };
    i.conditional_total = v;
    _ = function(e, i, n) {
        var o = e === undefined ? "all" : e,
            r;
        if (o === "all") {
            r = function(e) {
                n(e.map(d3.map))
            }
        } else {
            r = function(e) {
                n(d3.map(e))
            }
        }
        t.worker.callback("topic_conditional/" + i + "/" + o, r);
        t.worker.postMessage({
            what: "topic_conditional",
            t: o,
            v: i
        })
    };
    i.topic_conditional = _;
    h = function(e, i, n) {
        t.worker.callback("topic_docs/" + e + "/" + i, n);
        t.worker.postMessage({
            what: "topic_docs",
            t: e,
            n: i
        })
    };
    i.topic_docs = h;
    g = function(e, i, n, o, r) {
        t.worker.callback(["topic_docs_conditional", e, i, n, o].join("/"), r);
        t.worker.postMessage({
            what: "topic_docs_conditional",
            t: e,
            v: i,
            key: n,
            n: o
        })
    };
    i.topic_docs_conditional = g;
    y = function(e, i, n) {
        t.worker.callback("doc_topics/" + e + "/" + i, n);
        t.worker.postMessage({
            what: "doc_topics",
            d: e,
            n: i
        })
    };
    i.doc_topics = y;
    b = function(e, t) {
        var n = t || this.n_top_words(),
            o;
        if (e === undefined) {
            return d3.range(this.n()).map(function(e) {
                return i.topic_words(e, t)
            })
        }
        o = this.tw(e).entries();
        o.sort(function(e, t) {
            return d3.descending(e.value, t.value) || d3.ascending(e.key, t.key)
        });
        return utils.shorten(o, n, function(e, t) {
            return e[t].value
        }).map(function(e) {
            return {
                word: e.key,
                weight: e.value
            }
        })
    };
    i.topic_words = b;
    x = function(e, t) {
        var i, n, o, r = t || this.n_top_words(),
            a = [],
            d = function(e) {
                return e.values().reduce(function(e, t) {
                    return t > o ? e + 1 : e
                }, 0)
            };
        for (i = 0; i < this.n(); i += 1) {
            n = this.tw(i);
            if (n.has(e)) {
                o = n.get(e);
                a.push({
                    topic: i,
                    rank: d(n)
                })
            }
        }
        a.sort(function(e, t) {
            return d3.ascending(e.rank, t.rank) || d3.ascending(e.topic, t.topic)
        });
        return utils.shorten(a, r, function(e, t) {
            return e[t].rank
        })
    };
    i.word_topics = x;
    k = function(e) {
        var i = String(e + 1);
        if (t.info.topic_labels && t.info.topic_labels[i]) {
            return t.info.topic_labels[i]
        }
        return "Topic" + " " + i
    };
    i.topic_label = k;
    I = function(e) {
        var i;
        if (typeof e !== "string") {
            return
        }
        i = JSON.parse(e);
        t.alpha = i.alpha;
        t.tw = i.tw.map(function(e) {
            var t = d3.map();
            e.words.map(function(i, n) {
                t.set(i, e.weights[n])
            });
            return t
        });
        if (!t.n) {
            t.n = t.alpha.length
        }
    };
    i.set_tw = I;
    S = function(e, i) {
        if (typeof e !== "string") {
            i(false)
        }
        t.worker.callback("set_dt", function(e) {
            t.ready.dt = e.success;
            i(e)
        });
        t.worker.postMessage({
            what: "set_dt",
            dt: JSON.parse(e)
        })
    };
    i.set_dt = S;
    V = function(e) {
        t.meta = e;
        e.conditionals().forEach(A)
    };
    i.set_meta = V;
    A = function(e, i) {
        var n;
        n = t.meta.doc().map(i);
        t.worker.callback("set_doc_categories/" + e, function(i) {
            if (!t.ready.doc_categories) {
                t.ready.doc_categories = {}
            }
            t.ready.doc_categories[e] = i
        });
        t.worker.postMessage({
            what: "set_doc_categories",
            v: e,
            keys: n
        })
    };
    i.doc_category = A;
    j = function(e) {
        var i;
        if (typeof e !== "string") {
            return
        }
        i = e.replace(/^\n*/, "").replace(/\n*$/, "\n");
        t.topic_scaled = d3.csv.parseRows(i, function(e) {
            return e.map(parseFloat)
        })
    };
    i.set_topic_scaled = j;
    return i
};
"use strict";
bib.dfr = function(e) {
    var t = e || {},
        i = bib(t),
        n;
    i.sorting([
        ["year_authortitle", "by year, then by author"],
        ["issue_journalcontents", "by journal issue"],
        ["year_journalcontents", "by year, then by journal contents"],
        ["decade_date", "chronologically by decades"],
        ["decade_authortitle", "by decades, then by author"],
        ["author_authortitle", "alphabetically by author"]
    ]);
    i.keys.author = function(e) {
        return n(e.authors).replace(/^\W*/, "")[0].toUpperCase()
    };
    i.keys.authortitle = function(e) {
        var t = n(e.authors) + e.title;
        return t.toLowerCase()
    };
    i.keys.decade = function(e) {
        return Math.floor(e.date.getUTCFullYear() / 10).toString() + "0s"
    };
    i.keys.year = function(e) {
        return e.date.getUTCFullYear()
    };
    i.keys.journal = function(e) {
        return e.journal
    };
    i.keys.issue = function(e) {
        var t = e.journal;
        t += "_" + d3.format("05d")(e.volume);
        if (e.issue) {
            t += "_" + e.issue
        }
        return t
    };
    i.keys.issue.display_heading = function(e) {
        var t, i;
        t = e.split("_");
        i = t[0] + " " + String(+t[1]);
        if (t.length > 2) {
            i += "." + t[2]
        }
        return i
    };
    i.keys.date = function(e) {
        return +e.date
    };
    i.keys.journalcontents = function(e) {
        var t = e.journal;
        t += d3.format("05d")(e.volume);
        t += d3.format("05d")(e.issue === "" ? 0 : e.issue.replace(/\/.*$/, ""));
        if (e.pagerange.search(/^\d/) !== -1) {
            t += d3.format("05d")(e.pagerange.match(/^(\d+)/)[1])
        } else {
            t += e.pagerange
        }
        return t
    };
    i.sort.dir = function(e) {
        var t = {
            major: true,
            minor: true
        };
        if (e.dir === "up") {
            return t
        }
        if (e.dir === "down") {
            t.major = false;
            if (e.major === "decade" || e.major === "year" || e.major === "issue") {
                t.minor = e.minor !== "date" && e.minor !== "journal"
            } else if (e.major === "alpha" || e.major === "journal") {
                t.minor = e.minor !== "alpha"
            } else {
                t.minor = true
            }
        }
        return t
    };
    n = function(e) {
        var i, n, o, r = e.split(t.author_delimiter).filter(function(e) {
                return /\S/.test(e)
            }),
            a = r.length;
        if (a === 0) {
            return t.anon
        }
        i = r[0].replace(/,/g, "").split(" ");
        n = i.pop();
        if (i.length >= 2 && n.search(/^(\d|Jr|Sr|[IXV]+$)/) !== -1) {
            o = i.pop().replace(/_$/, "");
            n = ", " + n.replace(/\W*$/, "")
        } else {
            o = n;
            n = ""
        }
        o += ", " + i.join(" ") + n;
        if (a > 1) {
            if (a >= t.et_al) {
                o += ", ";
                o += r.slice(1, t.et_al).join(", ");
                o += "et al."
            } else {
                if (a > 2) {
                    o += ", "
                }
                o += r.slice(1, a - 1).join(", ");
                o += ", and " + r[a - 1]
            }
        }
        return o
    };
    i.doc_author = n;
    i.citation = function(e) {
        var t = n(e.authors),
            i;
        t = t.replace(/\.?$/, ". ");
        i = e.title.replace(/“/g, "‘").replace(/”/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1‘").replace(/"/g, "’").replace(/'/g, "’").replace(/ <br><\/br>/g, ". ");
        t += "“" + i + ".”";
        t = t.replace(/’\./g, ".’");
        t += " <em>" + e.journal + "</em> ";
        t += e.volume;
        if (e.issue) {
            t += ", no. " + e.issue
        }
        t += " (" + d3.time.format.utc("%B %Y")(e.date) + "): ";
        t += e.pagerange + ".";
        t = t.replace(/\.\./g, ".");
        t = t.replace(/_/g, ",");
        t = t.replace(/\t/g, "");
        return t
    };
    i.url = function(e) {
        return "http://www.jstor.org" + "/stable/" + e.doi
    };
    return i
};
"use strict";
metadata.dfr = function(e) {
    var t = e || {},
        i, n;
    i = metadata(t);
    if (!Array.isArray(t.extra_fields)) {
        t.extra_fields = []
    }
    n = function(e) {
        var i;
        if (typeof e !== "string") {
            return
        }
        i = e.replace(/^\n*/, "").replace(/\n*$/, "\n");
        t.docs = d3.csv.parseRows(i, function(e, i) {
            var n;
            n = {
                doi: e[0].trim(),
                title: e[1].trim(),
                authors: e[2].trim(),
                journal: e[3].trim(),
                volume: e[4].trim(),
                issue: e[5].trim(),
                date: new Date(e[6].trim()),
                pagerange: e[7].trim().replace(/^p?p\. /, "").replace(/-/g, "–")
            };
            e.slice(8, e.length).forEach(function(e, i) {
                n[t.extra_fields[i] || "X" + String(i)] = e.trim()
            });
            return n
        })
    };
    i.from_string = n;
    return i
};
"use strict";
view.about = function(e) {
    if (e.meta_info) {
        d3.select("div#meta_info").html(e.meta_info)
    }
    return true
};
"use strict";
view.bib = function(e) {
    var t = e.ordering.map(function(t) {
            var i = t;
            t.key = t.heading + "_" + e.minor + "_" + e.dir;
            return i
        }),
        i;
    d3.selectAll("select#select_bib_sort option").each(function() {
        this.selected = this.value === e.major + "_" + e.minor
    });
    d3.selectAll("select#select_bib_dir option").each(function() {
        this.selected = this.value === e.dir
    });
    d3.select("select#select_bib_sort").on("change", function() {
        var e;
        d3.selectAll("#select_bib_sort option").each(function() {
            if (this.selected) {
                e = this.value
            }
        });
        view.dfb().set_view("/bib/" + e.replace(/_/, "/"))
    });
    d3.select("select#select_bib_dir").on("change", function() {
        var t;
        d3.selectAll("#select_bib_dir option").each(function() {
            if (this.selected) {
                t = this.value
            }
        });
        view.dfb().set_view("/bib/" + e.major + "/" + e.minor + "/" + t)
    });
    d3.select("a#bib_sort_dir").attr("href", "#/bib/" + e.major + "/" + e.minor + "/" + (e.dir === "up" ? "down" : "up"));
    d3.select("#bib_headings a.top_link").on("click", function() {
        d3.event.preventDefault();
        view.scroll_top()
    });
    i = d3.select("#bib_view #bib_headings ul").selectAll("li").data(t, function(e) {
        return e.key
    });
    i.enter().append("li").append("a");
    i.exit().remove();
    view.bib.major_keys.forEach(function(t) {
        i.classed(t, e.major === t)
    });
    i.selectAll("a").attr("href", function(e) {
        return "#" + view.bib.id(e.heading)
    }).on("click", function(e) {
        d3.event.preventDefault();
        d3.select("#" + view.bib.id(e.heading)).node().scrollIntoView()
    }).text(function(e) {
        return e.heading_display || e.heading
    });
    view.bib.render({
        ordering: t,
        citations: e.citations,
        major: e.major
    });
    return true
};
view.bib.render = function(e) {
    var t, i, n;
    view.loading(true);
    t = d3.select("#bib_main").selectAll("div.section").data(e.ordering, function(e) {
        return e.key
    });
    i = t.enter().append("div").classed("section", true).attr("id", function(e) {
        return view.bib.id(e.heading)
    });
    i.append("h2").text(function(e) {
        return e.heading_display || e.heading
    });
    i.append("ul");
    t.exit().remove();
    n = t.select("ul").selectAll("li").data(function(e) {
        return e.docs
    });
    n.enter().append("li");
    n.exit().remove();
    n.html(function(t) {
        var i = '<a href="#/doc/' + t + '">';
        i += e.citations[t];
        i += "</a>";
        return i
    });
    view.loading("false")
};
view.bib.id = function(e) {
    return "bib_" + String(e).replace(/\W/g, "_")
};
view.bib.dropdown = function(e) {
    var t = d3.select("select#select_bib_sort").selectAll("option").data(e);
    t.enter().append("option");
    t.exit().remove();
    t.attr("id", function(e) {
        return "sort_" + e[0]
    }).property("value", function(e) {
        return e[0]
    }).text(function(e) {
        return e[1]
    });
    view.bib.major_keys = d3.set(e.map(function(e) {
        return e[0].split("_")[0]
    }))
};
"use strict";
view.doc = function(e) {
    var t = d3.select("div#doc_view"),
        i = e.total_tokens,
        n = e.topics,
        o, r;
    d3.select("#doc_view_main").classed("hidden", false);
    t.select("h2#doc_header").html(e.citation);
    t.select("#doc_remark .token_count").text(e.total_tokens);
    t.select("#doc_remark a.url").attr("href", e.url);
    o = t.select("table#doc_topics tbody").selectAll("tr").data(n.map(function(t, i) {
        return {
            topic: t.topic,
            weight: t.weight,
            label: e.labels[i],
            words: e.words[i]
        }
    }));
    r = o.enter().append("tr");
    o.exit().remove();
    o.on("click", function(e) {
        view.dfb().set_view(view.topic.hash(e.topic))
    });
    r.append("td").append("a").classed("topic_name", true).append("span").classed("name", true);
    o.select("a.topic_name").attr("href", function(e) {
        return view.topic.link(e.topic)
    }).select("span.name").text(function(e) {
        return e.label
    });
    r.append("td").append("a").classed("topic_words", true).append("span").classed("words", true);
    o.select("a.topic_words").attr("href", function(e) {
        return view.topic.link(e.topic)
    }).select("span.words").text(function(e) {
        return e.words.reduce(function(e, t) {
            return e + " " + t.word
        }, "")
    });
    view.weight_tds({
        sel: o,
        enter: r,
        w: function(e) {
            return e.weight / i
        },
        frac: function(e) {
            return VIS.percent_format(e.weight / i)
        },
        raw: e.proper ? undefined : function(e) {
            return e.weight
        }
    })
};
"use strict";
view.model = function() {
    return true
};
"use strict";
view.model.conditional = function(e) {
    var t = e.type ? e.type === "raw" : VIS.last.model_conditional,
        i = e.streamgraph && e.condition_type !== "ordinal",
        n = this.conditional.data;
    VIS.last.model_conditional = t;
    if (!n || n.signature !== e.signature || n.streamgraph !== e.streamgraph) {
        n = view.model.stacked_series({
            keys: e.key.range,
            xs: e.key.range.map(e.key.invert),
            totals: e.conditional_totals,
            topics: e.topics,
            streamgraph: i
        });
        n.streamgraph = i;
        n.signature = e.signature;
        this.conditional.data = n
    }
    view.model.conditional_plot({
        condition_type: e.condition_type,
        condition_name: e.condition_name,
        data: n[t ? "raw" : "frac"],
        domain_x: n.domain_x,
        domain_y: n[t ? "domain_raw" : "domain_frac"],
        order: n.order,
        spec: VIS.model_view.conditional,
        raw: t,
        selector: "#model_view_conditional"
    });
    d3.selectAll("#conditional_choice li").classed("active", false);
    d3.select(t ? "#nav_model_conditional_raw" : "#nav_model_conditional_frac").classed("active", true)
};
view.model.conditional_plot = function(e) {
    var t = e.spec,
        i, n, o, r, a, d, s, c, l, u, f, p, m, w, _, v;
    t.w = d3.select(e.selector).node().clientWidth || t.w;
    t.w -= t.m.left + t.m.right;
    t.h = Math.floor(t.w / t.aspect);
    t.h -= t.m.top + t.m.bottom;
    i = view.plot_svg(e.selector, t);
    l = i.selectAll("rect.bg").data([1]).enter().append("rect").classed("bg", true);
    l.attr("width", t.w).attr("height", t.h).classed("bg", true);
    u = d3.select("#model_conditional_clip");
    if (u.size() === 0) {
        u = d3.select("#model_view_conditional svg").append("clipPath").attr("id", "model_conditional_clip");
        u.append("rect").attr("x", 0).attr("y", 0).attr("width", t.w).attr("height", t.h)
    }
    d3.select("#model_conditional_clip rect").transition().duration(2e3).attr("width", t.w).attr("height", t.h);
    c = function() {
        var t = d3.scale.category20(),
            i = [];
        e.order.forEach(function(e, t) {
            i[e] = t
        });
        return function(e, n) {
            var o = t(i[e] % 20);
            return n ? d3.hsl(o).brighter(.5).toString() : o
        }
    }();
    if (e.condition_type === "ordinal") {
        n = d3.scale.ordinal().domain(e.domain_x).rangeRoundBands([0, t.w], t.ordinal.bar);
        f = "g"
    } else {
        n = e.condition_type === "time" ? d3.time.scale.utc() : d3.scale.linear();
        n.domain(e.domain_x).range([0, t.w]);
        f = "path"
    }
    o = d3.scale.linear().domain(e.domain_y).range([t.h, 0]).nice();
    r = d3.svg.axis().scale(n).orient("bottom");
    d = i.selectAll("g.axis").data([1]);
    d.enter().append("g").classed("axis", true).classed("x", true).attr("transform", "translate(0," + t.h + ")");
    d.transition().duration(2e3).attr("transform", "translate(0," + t.h + ")").call(r);
    if (e.condition_type !== "time") {
        a = i.selectAll("text.axis_label").data([1]);
        a.enter().append("text");
        a.classed("axis_label", true).attr("x", t.w / 2).attr("y", t.h + t.m.bottom).attr("text-anchor", "middle").text(e.condition_name)
    }
    p = i.selectAll(f + ".topic_area").data(e.data, function(e) {
        return e.t
    });
    p.enter().append(f).classed("topic_area", true).attr("clip-path", "url(#model_conditional_clip)").style("fill", function(e) {
        return c(e.t)
    }).on("mouseover", function(t) {
        var i = t.label;
        d3.select(this).style("fill", c(t.t, true));
        if (e.spec.words > 0) {
            i += ": ";
            i += t.words.join(" ")
        }
        view.tooltip().text(i);
        view.tooltip().update_pos();
        view.tooltip().show()
    }).on("mousemove", function(e) {
        view.tooltip().update_pos()
    }).on("mouseout", function(e) {
        d3.select(this).style("fill", c(e.t));
        view.tooltip().hide()
    }).on("click", function(e) {
        if (!d3.event.shiftKey) {
            view.dfb().set_view(view.topic.hash(e.t))
        }
    });
    p.exit().remove();
    if (f === "path") {
        s = d3.svg.area().x(function(e) {
            return n(e.x)
        }).y0(function(e) {
            return o(e.y0)
        }).y1(function(e) {
            return o(e.y0 + e.y)
        });
        m = function(e) {
            return function(t) {
                var i = e ? t.transition().duration(2e3) : t;
                i.attr("d", function(e) {
                    return s(e.values)
                })
            }
        }
    } else {
        m = function(e) {
            return function(t) {
                var i = t.selectAll("rect").data(function(e) {
                    return e.values
                });
                i.enter().append("rect");
                i.exit().remove();
                if (e) {
                    i = i.transition().duration(2e3)
                }
                i.attr("x", function(e) {
                    return n(e.x)
                }).attr("y", function(e) {
                    return o(e.y0 + e.y)
                }).attr("width", n.rangeBand()).attr("height", function(e) {
                    return o(e.y0) - o(e.y0 + e.y)
                })
            }
        }
    }
    p.call(m(true));
    w = i.selectAll("text.layer_label").data(e.data, function(e) {
        return e.t
    });
    w.enter().append("text").classed("layer_label", true).attr("clip-path", "url(#model_conditional_clip)");
    w.exit().remove();
    _ = function(i) {
        var r, a, d, s, c, l = [],
            u = [],
            f = n.domain()[0],
            p = n.domain()[1],
            m = o.domain()[0],
            w = o.domain()[1],
            _ = o(0);
        for (r = 0; r < e.data.length; r += 1) {
            d = e.data[r].t;
            l[d] = false;
            s = e.data[r].values;
            for (a = 0, c = 0; a < s.length; a += 1) {
                if (s[a].x >= f && s[a].x <= p && s[a].y0 + s[a].y >= m && s[a].y0 + s[a].y <= w) {
                    if (s[a].y > c && _ - o(s[a].y) > t.label_threshold) {
                        l[d] = true;
                        u[d] = a;
                        c = s[a].y
                    }
                }
            }
        }
        i.attr("display", function(e) {
            return l[e.t] ? "inherit" : "none"
        });
        i.filter(function(e) {
            return l[e.t]
        }).attr("x", function(e) {
            return n(e.values[u[e.t]].x)
        }).attr("y", function(e) {
            return o(e.values[u[e.t]].y0 + e.values[u[e.t]].y / 2)
        }).text(function(e) {
            var i = e.label;
            if (t.label_words > 0) {
                i += ": ";
                i += e.words.slice(0, t.label_words).join(" ")
            }
            return i
        })
    };
    w.transition().duration(2e3).call(_);
    v = d3.behavior.zoom();
    if (e.condition_type !== "ordinal") {
        v.x(n)
    }
    v.y(o).scaleExtent([1, 5]).on("zoom", function() {
        p.call(m(VIS.zoom_transition));
        if (VIS.zoom_transition) {
            i.select("g.x.axis").transition().duration(2e3).call(r);
            w.transition().duration(2e3).call(_);
            VIS.zoom_transition = false
        } else {
            w.call(_);
            i.select("g.x.axis").call(r)
        }
    });
    d3.select("button#reset_zoom").on("click", function() {
        VIS.zoom_transition = true;
        v.translate([0, 0]).scale(1).event(i)
    });
    v(i);
    return true
};
view.model.stacked_series = function(e) {
    var t, i, n, o = {};
    t = e.topics.map(function(t) {
        var i = {
            t: t.t,
            words: t.words.map(function(e) {
                return e.word
            }),
            label: t.label
        };
        i.values = e.keys.map(function(i, n) {
            return {
                key: i,
                x: e.xs[n],
                y: t.wts.get(i) || 0
            }
        });
        return i
    });
    i = d3.layout.stack().values(function(e) {
        return e.values
    });
    if (e.streamgraph) {
        i.offset("wiggle")
    }
    i.order("inside-out");
    o.frac = i(t);
    o.order = i.order()(t.map(function(e) {
        return e.values.map(function(e) {
            return [e.x, e.y]
        })
    }));
    i.order(function(e) {
        return o.order
    });
    o.raw = i(t.map(function(t) {
        return {
            t: t.t,
            words: t.words,
            label: t.label,
            values: t.values.map(function(t) {
                return {
                    x: t.x,
                    y: t.y * (e.totals.get(t.key) || 0)
                }
            })
        }
    }));
    n = function(e) {
        return [0, d3.max(e.map(function(e) {
            return d3.max(e.values, function(e) {
                return e.y0 + e.y
            })
        }))]
    };
    o.domain_x = d3.extent(e.xs);
    o.domain_frac = n(o.frac);
    o.domain_raw = n(o.raw);
    return o
};
"use strict";
view.model.list = function(e) {
    var t, i, n, o, r = d3.sum(e.sums),
        a, d, s, c, l;
    l = utils.clone(VIS.model_view.list.spark);
    l.time.step = VIS.condition.spec;
    d3.select("th#model_view_list_condition a").text(e.type === "time" ? "over time" : "by " + e.condition_name);
    t = d3.select("#model_view_list table tbody").selectAll("tr").data(e.data.map(function(t, i) {
        return {
            t: i,
            data: t,
            label: e.labels[i]
        }
    }));
    i = t.enter().append("tr");
    t.exit().remove();
    t.on("click", function(e) {
        view.dfb().set_view(view.topic.hash(e.t))
    });
    t.classed("hidden_topic", function(t) {
        return e.topic_hidden[t.t]
    });
    i.append("td").append("a").classed("topic_name", true);
    t.select("a.topic_name").attr("href", function(e) {
        return view.topic.link(e.t)
    }).text(function(e) {
        return e.label
    });
    n = i.append("td").append("div").classed("spark", true);
    view.append_svg(n, l).each(function(t) {
        view.topic.conditional_barplot({
            t: t.t,
            data: t.data,
            key: e.key,
            type: e.type,
            axes: false,
            clickable: false,
            transition: false,
            svg: d3.select(this),
            spec: l
        })
    });
    i.append("td").append("a").classed("topic_words", true);
    t.select("a.topic_words").attr("href", function(e) {
        return view.topic.link(e.t)
    });
    t.selectAll("td a.topic_words").text(function(t) {
        return e.words[t.t].reduce(function(e, t) {
            return e + " " + t.word
        }, "")
    });
    o = d3.max(e.sums);
    view.weight_tds({
        sel: t,
        enter: i,
        w: function(t) {
            return e.sums[t.t] / o
        },
        frac: function(t) {
            return VIS.percent_format(e.sums[t.t] / r)
        }
    });
    if (!VIS.last.model_list) {
        VIS.last.model_list = {}
    }
    s = e.sort || VIS.last.model_list.sort || "topic";
    c = e.dir || (s === VIS.last.model_list.sort ? VIS.last.model_list.dir : "up") || "up";
    if (s === "words") {
        a = e.words.map(function(e) {
            return e.reduce(function(e, t) {
                return e + " " + t.word
            }, "")
        })
    } else if (s === "frac") {
        a = e.sums.map(function(e) {
            return -e / r
        })
    } else if (s === "condition") {
        a = e.data.map(function(e) {
            var t, i = 0;
            e.forEach(function(e, n) {
                if (n > i) {
                    t = e;
                    i = n
                }
            });
            return t
        })
    } else {
        a = e.labels.map(view.topic.sort_name)
    }
    if (c === "down") {
        d = function(e, t) {
            return d3.descending(a[e.t], a[t.t]) || d3.descending(e.t, t.t)
        }
    } else {
        d = function(e, t) {
            return d3.ascending(a[e.t], a[t.t]) || d3.ascending(e.t, t.t)
        }
    }
    VIS.last.model_list.sort = s;
    VIS.last.model_list.dir = c;
    t.sort(d).order();
    d3.selectAll("#model_view_list th.sort").classed("active", function() {
        return !!this.id.match(s)
    }).each(function() {
        var e = "#/" + this.id.replace(/_(view_)?/g, "/");
        if (this.id.match(s)) {
            e += c === "down" ? "/up" : "/down"
        }
        d3.select(this).select("a").attr("href", e)
    }).on("click", function() {
        view.dfb().set_view(d3.select(this).select("a").attr("href").replace(/#/, ""))
    });
    return true
};
"use strict";
view.model.plot = function(e) {
    var t, i, n, o, r, a, d, s, c, l, u, f, p, m, w, _, v = e.topics,
        h = e.topics.length,
        g = {};
    g.w = d3.select("#model_view").node().clientWidth || VIS.model_view.plot.w;
    g.w = Math.max(g.w, VIS.model_view.plot.w);
    g.h = Math.floor(g.w / VIS.model_view.plot.aspect);
    g.m = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    t = view.plot_svg("#model_view_plot", g);
    n = Math.floor(g.w / (2.1 * Math.sqrt(VIS.model_view.plot.aspect * h)));
    i = n * 1.8;
    o = 1.1 * n;
    r = t.selectAll("rect.bg").data([1]);
    r.enter().append("rect").classed("bg", true);
    r.attr("width", g.w);
    r.attr("height", g.h);
    if (e.type === "scaled") {
        v.forEach(function(e, t) {
            v[t].x = e.scaled[0];
            v[t].y = e.scaled[1]
        })
    } else {
        v.forEach(function(e, t) {
            v[t].sort_key = view.topic.sort_name(e.label)
        });
        v = v.sort(function(e, t) {
            return d3.ascending(e.sort_key, t.sort_key)
        });
        view.model.grid_coords({
            n: h,
            cols: VIS.model_view.plot.cols || Math.floor(Math.sqrt(VIS.model_view.plot.aspect * h)),
            rows: VIS.model_view.plot.rows,
            indents: VIS.model_view.plot.indents
        }).forEach(function(e, t) {
            v[t].x = e.x;
            v[t].y = e.y
        })
    }
    a = d3.extent(v, function(e) {
        return e.x
    });
    d = d3.extent(v, function(e) {
        return e.y
    });
    s = d3.scale.linear().domain(a).range([o, g.w - o]);
    c = d3.scale.linear().domain(d).range([g.h - o, o]);
    l = d3.scale.sqrt().domain([0, 1]).range(VIS.model_view.plot.size_range);
    u = d3.scale.linear().domain([0, d3.max(v, function(e) {
        return e.total
    })]).range([0, VIS.model_view.plot.stroke_range]);
    f = t.selectAll("g").data(v, function(e) {
        return e.t
    });
    p = f.enter().append("g");
    f.exit().remove();
    p.append("clipPath").attr("id", function(e) {
        return "clip_circ" + e.t
    }).append("circle").attr({
        cx: 0,
        cy: 0
    });
    p.append("circle").attr("cx", 0).attr("cy", 0).classed("topic_cloud", true).attr("stroke-width", function(e) {
        return u(e.total)
    }).on("click", function(e) {
        if (!d3.event.shiftKey) {
            view.dfb().set_view(view.topic.hash(e.t))
        }
    }).on("mouseover", function(e) {
        f.sort(function(t, i) {
            if (t.t === i.t) {
                return 0
            }
            if (t.t === e.t) {
                return 1
            }
            if (i.t === e.t) {
                return -1
            }
            return d3.ascending(t.t, i.t)
        }).order()
    }).on("mouseout", function() {
        f.sort(function(e, t) {
            return d3.ascending(e.t, t.t)
        }).order()
    });
    m = f.selectAll("text.topic_word").data(function(e) {
        var t = e.words[0].weight,
            n = e.words.map(function(i) {
                return {
                    text: i.word,
                    size: Math.floor(l(i.weight / t)),
                    t: e.t
                }
            }),
            o = 0,
            r = 0,
            a = false,
            d;
        for (d = 0; d < n.length; d += 1, a = !a) {
            if (a) {
                n[d].y = o;
                o -= n[d].size
            } else {
                r += n[d].size;
                n[d].y = r
            }
            if (o - i / 2 < n[d].size && r > i / 2) {
                break
            }
        }
        return n.slice(0, d)
    });
    m.enter().append("text").classed("topic_word", true).attr("clip-path", function(e) {
        return "url(#" + "clip_circ" + e.t
    }).style("font-size", "1px");
    m.text(function(e) {
        return e.text
    }).attr("x", 0).attr("y", function(e) {
        return e.y
    });
    p.selectAll("text.topic_name").data(function(e) {
        var t = e.label.split(" ");
        return t.map(function(e, i) {
            return {
                w: e,
                y: VIS.model_view.plot.name_size * (i - (t.length - 1) / 2)
            }
        })
    }).enter().append("text").classed("topic_name", true).attr("x", 0).attr("y", function(e) {
        return e.y
    }).text(function(e) {
        return e.w
    }).style("font-size", VIS.model_view.plot.name_size + "px").classed("merged_topic_sep", function(e) {
        return e.w === "or"
    });
    w = function(e) {
        var t = "translate(" + s(e.x);
        t += "," + c(e.y) + ")";
        return t
    };
    f.transition().duration(1e3).attr("transform", w).selectAll("circle").attr("r", n);
    p.transition().duration(0).attr("transform", w).selectAll("circle").attr("r", n);
    m.transition().duration(1e3).style("font-size", function(e) {
        return e.size + "px"
    });
    p.selectAll("text.topic_word").transition().duration(0).style("font-size", function(e) {
        return e.size + "px"
    });
    m.exit().transition().duration(1e3).style("font-size", "1px").remove();
    if (e.type === "scaled") {
        _ = d3.behavior.zoom().x(s).y(c).scaleExtent([1, 10]).on("zoom", function() {
            if (VIS.zoom_transition) {
                f.transition().duration(1e3).attr("transform", w);
                VIS.zoom_transition = false
            } else {
                f.attr("transform", w)
            }
        });
        d3.select("button#reset_zoom").on("click", function() {
            VIS.zoom_transition = true;
            _.translate([0, 0]).scale(1).event(t)
        });
        _(t)
    } else {
        t.on(".zoom", null)
    }
};
view.model.grid_coords = function(e) {
    var t = e.cols || Math.floor(Math.sqrt(e.n)),
        i = Math.round(e.n / t),
        n = e.n - i * t,
        o = d3.ascending(n, 0),
        r, a, d, s, c, l = [];
    d = Math.sqrt(3) / 2;
    if (e.rows && d3.sum(e.rows) === e.n) {
        r = e.rows;
        i = e.rows.length;

    }
    if (r === undefined) {
        r = [];
        for (s = o === 1 ? 0 : 1; s < i; s += 2) {
            r[s] = t;
            if (Math.abs(n) > 0) {
                r[s] += o;
                n -= o
            }
        }
        for (s = o === 1 ? 1 : 0; s < i; s += 2) {
            r[s] = t;
            if (Math.abs(n) > 0) {
                r[s] += o;
                n -= o
            }
        }
        if (o === -1) {
            r.reverse()
        }
    }
    if (e.indents && e.indents.length === i) {
        a = e.indents
    }
    if (a === undefined) {
        a = d3.range(i).map(function(e) {
            return e % 2 === 0 ? 0 : .5
        })
    }
    for (s = 0; s < i; s += 1) {
        for (c = 0; c < r[s]; c += 1) {
            l.push({
                x: c + .5 + a[s],
                y: (i - s) * d + .5
            })
        }
    }
    return l
};
"use strict";
view.settings = function(e) {
    var t;
    t = d3.select("#settings_modal");
    t.select("#n_words_list input").property("min", 1).property("max", e.max_words).property("value", VIS.overview_words).on("change", function() {
        VIS.overview_words = this.valueAsNumber
    });
    t.select("#n_words_topic input").property("min", 1).property("max", e.max_words).property("value", VIS.topic_view.words).on("change", function() {
        VIS.topic_view.words = this.valueAsNumber
    });
    t.select("#n_topic_docs input").property("min", 1).property("max", e.max_docs).property("value", VIS.topic_view.docs).on("change", function() {
        VIS.topic_view.docs = this.valueAsNumber
    });
    t.select("#reveal_hidden").classed("hidden", VIS.hidden_topics.length === 0).select("input").property("checked", VIS.show_hidden_topics === true).on("change", function() {
        VIS.show_hidden_topics = !VIS.show_hidden_topics
    });
    t.select("#conditional_streamgraph").classed("hidden", VIS.condition.type === "ordinal").select("input").property("checked", !!VIS.model_view.conditional.streamgraph).on("change", function() {
        VIS.model_view.conditional.streamgraph = !VIS.model_view.conditional.streamgraph
    })
};
"use strict";
view.topic = function(e) {
    var t = d3.select("div#topic_view");
    t.select("#topic_header").text(e.label)
};
view.topic.remark = function(e) {
    d3.select("#topic_view #topic_remark").text(VIS.percent_format(e.col_sum / e.total_tokens) + " of corpus")
};
view.topic.words = function(e) {
    var t, i;
    t = d3.select("table#topic_words tbody").selectAll("tr").data(e);
    i = t.enter().append("tr");
    t.exit().remove();
    t.on("click", function(e) {
        view.dfb().set_view("/word/" + e.word)
    });
    i.append("td").classed("topic_word", true).append("a");
    t.select("td.topic_word a").attr("href", function(e) {
        return "#/word/" + e.word
    }).text(function(e) {
        return e.word
    });
    view.weight_tds({
        sel: t,
        enter: i,
        w: function(t) {
            return t.weight / e[0].weight
        }
    })
};
view.topic.docs = function(e) {
    var t, i, n, o = e.docs;
    if (e.condition !== undefined) {
        t = ": ";
        if (e.type !== "time") {
            t += e.condition_name + " "
        }
        t += e.key.display(e.condition);
        d3.select("#topic_condition_clear").classed("disabled", false).on("click", function() {
            d3.select(".selected_condition").classed("selected_condition", false);
            view.dfb().set_view(view.topic.hash(e.t))
        }).classed("hidden", false)
    } else {
        t = "";
        d3.select("#topic_condition_clear").classed("disabled", true)
    }
    d3.selectAll("#topic_docs span.topic_condition").text(t);
    if (o === undefined || o.length === 0) {
        d3.selectAll("#topic_docs .none").classed("hidden", false);
        d3.select("#topic_docs table").classed("hidden", true);
        return true
    }
    d3.selectAll("#topic_docs .none").classed("hidden", true);
    d3.select("#topic_docs table").classed("hidden", false);
    i = d3.select("#topic_docs tbody").selectAll("tr").data(o);
    n = i.enter().append("tr");
    i.exit().remove();
    n.append("td").append("a").classed("citation", true);
    i.select("a.citation").html(function(t, i) {
        return e.citations[i]
    });
    i.on("click", function(e) {
        view.dfb().set_view("/doc/" + e.doc)
    });
    view.weight_tds({
        sel: i,
        enter: n,
        w: function(e) {
            return e.frac
        },
        frac: function(e) {
            return VIS.percent_format(e.frac)
        },
        raw: e.proper ? undefined : function(e) {
            return e.weight
        }
    })
};
view.topic.conditional = function(e) {
    var t = utils.clone(VIS.topic_view);
    t.w = d3.select("#topic_conditional").node().clientWidth || t.w;
    t.w = Math.max(t.w, VIS.topic_view.w);
    t.w -= t.m.left + t.m.right;
    t.h = Math.floor(t.w / VIS.topic_view.aspect) - t.m.top - t.m.bottom;
    t.time.step = VIS.condition.spec;
    e.svg = view.plot_svg("div#topic_plot", t);
    e.axes = true;
    e.clickable = true;
    e.spec = t;
    view.topic.conditional_barplot(e)
};
view.topic.conditional_barplot = function(e) {
    var t, i, n, o, r, a, d, s, c, l, u, f, p, m, w, _ = e.transition ? e.spec.tx_duration : 0,
        v = e.svg,
        h = e.spec;
    t = e.data.keys().sort().map(function(t) {
        return {
            key: t,
            x: e.key.invert(t),
            y: e.data.get(t)
        }
    });
    if (e.type === "continuous") {
        t[0].w = Infinity;
        i = t.reduce(function(e, t) {
            return {
                x: t.x,
                w: Math.min(t.x - e.x, e.w)
            }
        }).w;
        delete t[0].w;
        d = d3.scale.linear().domain([t[0].x, t[t.length - 1].x + i * h.continuous.bar.w]).range([0, h.w]);
        n = d(t[0].x + i * h.continuous.bar.w) - d(t[0].x);
        r = -n / 2;
        o = d(t[0].x + i) - d(t[0].x);
        a = -o / 2;
        m = o / 2
    } else if (e.type === "time") {
        d = d3.time.scale.utc().domain([t[0].x, d3.time[h.time.bar.unit].utc.offset(t[t.length - 1].x, h.time.bar.w)]).range([0, h.w]);
        n = d(d3.time[h.time.bar.unit].utc.offset(t[0].x, h.time.bar.w)) - d(t[0].x);
        r = -n / 2;
        o = d(d3.time[h.time.step.unit].utc.offset(t[0].x, h.time.step.n)) - d(t[0].x);
        a = -o / 2;
        m = o / 2
    } else {
        d = d3.scale.ordinal().domain(t.map(function(e) {
            return e.x
        })).rangeRoundBands([0, h.w], h.ordinal.bar.w, h.ordinal.bar.w);
        n = d.rangeBand();
        r = 0;
        o = d(t[1].x) - d(t[0].x);
        a = (n - o) / 2;
        m = 3
    }
    s = d3.scale.linear().domain([0, d3.max(t, function(e) {
        return e.y
    })]).range([h.h, 0]).nice();
    if (e.axes) {
        f = v.selectAll("g.axis").data(["x", "y"]);
        f.enter().append("g").classed("axis", true).classed("x", function(e) {
            return e === "x"
        }).classed("y", function(e) {
            return e === "y"
        }).attr("transform", function(e) {
            return e === "x" ? "translate(0," + h.h + ")" : "translate(-5, 0)"
        });
        f.transition().duration(_).attr("transform", function(e) {
            return e === "x" ? "translate(0," + h.h + ")" : undefined
        }).each(function(t) {
            var i = d3.select(this),
                n = d3.svg.axis().scale(t === "x" ? d : s).orient(t === "x" ? "bottom" : "left");
            if (t === "x") {
                if (e.type === "time") {
                    if (h.time.ticks.unit) {
                        n.ticks(d3.time[h.time.ticks.unit].utc, h.time.ticks.n)
                    } else if (typeof h.time.ticks === "number") {
                        n.ticks(h.time.ticks)
                    }
                } else {
                    n.ticks(h[e.type].ticks)
                }
            } else {
                n.tickSize(-h.w).outerTickSize(0).tickFormat(VIS.percent_format).tickPadding(m).ticks(h.ticks_y)
            }
            i.call(n);
            if (t === "y") {
                i.selectAll("g").filter(function(e) {
                    return e > 0
                }).classed("minor", true)
            }
        });
        p = v.selectAll("text.axis_label").data([1]);
        p.enter().append("text");
        p.classed("axis_label", true).attr("x", h.w / 2).attr("y", h.h + h.m.bottom).attr("text-anchor", "middle").text(e.condition_name)
    }
    c = v.selectAll("g.topic_proportion").data(t, function(e) {
        return e.key
    });
    l = c.enter().append("g").classed("topic_proportion", true).attr("transform", function(e) {
        return "translate(" + d(e.x) + ",0)"
    });
    c.exit().remove();
    if (e.clickable) {
        l.append("rect").classed("interact", true);
        u = c.select("rect.interact");
        u.transition().duration(_).attr("x", a).attr("y", 0).attr("width", o).attr("height", h.h)
    }
    c.classed("selected_condition", function(t) {
        return t.key === e.condition
    });
    l.append("rect").classed("display", true).style("fill", e.color).style("stroke", e.color);
    c.transition().duration(_).attr("transform", function(e) {
        return "translate(" + d(e.x) + ",0)"
    }).select("rect.display").attr("x", r).attr("y", function(e) {
        return s(e.y)
    }).attr("width", n).attr("height", function(e) {
        return h.h - s(e.y)
    });
    if (e.clickable) {
        c.on("mouseover", function(e) {
            d3.select(this).classed("hover", true)
        }).on("mouseout", function(e) {
            d3.select(this).classed("hover", false)
        });
        w = function(t) {
            return e.key.display(t.key)
        };
        u.on("mouseover", function(e) {
            var t = d3.select(this.parentNode);
            t.select(".display").classed("hover", true);
            view.tooltip().text(w(e));
            view.tooltip().update_pos();
            view.tooltip().show()
        }).on("mousemove", function(e) {
            view.tooltip().update_pos()
        }).on("mouseout", function(e) {
            d3.select(this.parentNode).select(".display").classed("hover", false);
            view.tooltip().hide()
        }).on("click", function(t) {
            if (d3.select(this.parentNode).classed("selected_condition")) {
                d3.select(this.parentNode).classed("selected_condition", false);
                view.tooltip().text(w(t));
                view.dfb().set_view(view.topic.hash(e.t))
            } else {
                d3.selectAll(".selected_condition").classed("selected_condition", false);
                d3.select(this.parentNode).classed("selected_condition", true);
                view.tooltip().text(w(t));
                view.dfb().set_view(view.topic.hash(e.t) + "/" + t.key)
            }
        })
    }
};
view.topic.sort_name = function(e) {
    var t = e.match(/^Topic\s(\d+)$/);
    if (t) {
        return "zzz" + d3.format("05d")(+t[1])
    }
    return e.replace(/^(the|a|an) /i, "").toLowerCase()
};
view.topic.dropdown = function(e) {
    var t;
    d3.select("ul#topic_dropdown").selectAll("li.loading_message").remove();
    t = d3.select("ul#topic_dropdown").selectAll("li").data(e, function(e) {
        return e.topic
    });
    t.enter().append("li").append("a").text(function(e) {
        var t = e.words.slice(0, VIS.overview_words).map(function(e) {
            return e.word
        }).join(" ");
        return e.label + ": " + t
    }).attr("href", function(e) {
        return view.topic.link(e.topic)
    });
    t.sort(function(e, t) {
        return d3.ascending(view.topic.sort_name(e.label), view.topic.sort_name(t.label))
    });
    t.classed("hidden_topic", function(e) {
        return e.hidden
    })
};
view.topic.link = function(e) {
    return "#" + view.topic.hash(e)
};
view.topic.hash = function(e) {
    return "/topic/" + String(e + 1)
};
"use strict";
view.word = function(e) {
    var t = d3.select("div#word_view"),
        i = e.word,
        n = e.n,
        o, r, a, d, s, c, l, u, f, p, m, w, _, v, h = !e.updating,
        g;
    d3.select("form#word_view_form").on("submit", function() {
        d3.event.preventDefault();
        var e = d3.select("input#word_input").property("value").toLowerCase();
        view.dfb().set_view("/word/" + e)
    });
    if (e.word === undefined) {
        return
    }
    t.selectAll("#word_view span.word").text(i);
    t.selectAll("#word_view .none").classed("hidden", e.topics.length !== 0);
    t.select("table#word_topics").classed("hidden", e.topics.length === 0);
    t.select("#word_view_explainer").classed("hidden", e.topics.length === 0);
    o = e.topics.map(function(t, i) {
        var n, o = e.words[i];
        return o.map(function(e, t) {
            if (t === 0) {
                n = e.weight
            }
            return {
                word: e.word,
                weight: e.weight / n
            }
        })
    });
    r = {
        m: VIS.word_view.m
    };
    r.w = d3.select("#main_container").node().clientWidth || VIS.word_view.w;
    r.w -= r.m.left + r.m.right;
    r.h = VIS.word_view.row_height * (e.topics.length + 1);
    a = VIS.word_view.row_height;
    s = view.plot_svg("#word_view_main", r);
    d = Math.max(r.w, VIS.word_view.w);
    l = d3.scale.linear().domain([0, n]).range([0, d]);
    u = d3.scale.linear().domain([0, Math.max(1, e.topics.length - 1)]).range([a, a * (Math.max(e.topics.length, 1) + 1)]);
    f = d3.scale.linear().domain([0, 1]).range([0, a / 2]);
    c = d3.select("#word_view_clip");
    if (c.size() === 0) {
        c = d3.select("#word_view svg").append("clipPath").attr("id", "word_view_clip");
        c.append("rect")
    }
    c.select("rect").attr("x", -r.m.left).attr("y", -r.m.top).attr("width", r.w + r.m.left + r.m.right).attr("height", r.h + r.m.top + r.m.bottom);
    s.attr("clip-path", "url(#word_view_clip)");
    p = s.selectAll("g.topic").data(e.topics, function(e) {
        return e.topic
    });
    p.transition().duration(1e3).attr("transform", function(e, t) {
        return "translate(0," + u(t) + ")"
    });
    m = p.enter().append("g").classed("topic", true).attr("transform", function(e, t) {
        return "translate(0," + u(t) + ")"
    }).style("opacity", h ? 1 : 0);
    d3.transition().duration(1e3).ease("linear").each("end", function() {
        p.style("opacity", 1)
    });
    p.exit().transition().duration(2e3).attr("transform", "translate(0," + a * (n + p.exit().size()) + ")").remove();
    m.append("rect").classed("interact", true).attr({
        x: -r.m.left,
        y: -a,
        width: r.m.left,
        height: a
    }).on("click", function(e) {
        view.dfb().set_view(view.topic.hash(e.topic))
    });
    w = p.selectAll("text.topic").data(function(t, i) {
        var n = e.labels[i].split(" ");
        return n.map(function(e, t) {
            return {
                word: e,
                y: -a / 2 - (n.length / 2 - t - 1) * VIS.word_view.topic_label_leading
            }
        })
    }, function(e, t) {
        return e.word + String(t)
    });
    w.enter().append("text").classed("topic", true);
    w.exit().remove();
    w.attr("x", -VIS.word_view.topic_label_padding).attr("y", function(e) {
        return e.y
    }).text(function(e) {
        return e.word
    }).classed("merged_topic_sep", function(e) {
        return e.word === "or"
    });
    _ = p.selectAll("g.word").data(function(e, t) {
        return o[t]
    }, function(e) {
        return e.word
    });
    v = _.enter().append("g").classed("word", true);
    v.append("text").attr("transform", "rotate(-45)");
    v.append("rect").classed("proportion", true).attr({
        x: 0,
        y: 0
    }).attr("width", d / (2 * n)).attr("height", function(e) {
        return f(e.weight)
    });
    _.selectAll("text").text(function(e) {
        return e.word
    });
    _.selectAll("text, rect").on("click", function(e) {
        view.dfb().set_view("/word/" + e.word)
    }).on("mouseover", function() {
        d3.select(this.parentNode).classed("hover", true)
    }).on("mouseout", function() {
        d3.select(this.parentNode).classed("hover", false)
    });
    _.classed("selected_word", function(e) {
        return e.word === i
    });
    v.attr("transform", function(e, t) {
        return "translate(" + l(t) + ",-" + a / 2 + ")"
    }).attr("opacity", h ? 0 : 1);
    g = _.transition().duration(2e3).attr("transform", function(e, t) {
        return "translate(" + l(t) + ",-" + a / 2 + ")"
    }).attr("opacity", 1);
    g.selectAll("text").attr("x", d / (4 * n));
    g.selectAll("rect").attr("width", d / (2 * n)).attr("height", function(e) {
        return f(e.weight)
    });
    _.exit().transition().delay(1e3).remove();
    return true
};
"use strict";
view.words = function(e) {
    var t = d3.select("ul#vocab_list").selectAll("li").data(e);
    t.exit().remove();
    t.enter().append("li").append("a");
    t.select("a").text(function(e) {
        return e
    }).attr("href", function(e) {
        return "#/word/" + e
    });
    return true
};
"use strict";
var dfb = function(e) {
    var t = e || {},
        i = {},
        n, o, r, a, d, s, c, l, u, f, p, m;
    t.m = model();
    if (view.dfb() === undefined) {
        view.dfb(i)
    } else {
        view.error("view.dfb already defined: dfb() called more than once?")
    }
    t.views = d3.map();
    t.views.set("topic", function(e, i) {
        var n, o = +e - 1,
            r;
        if (!t.m.meta() || !t.m.has_dt() || !t.m.tw()) {
            view.loading(true);
            return true
        }
        if (!isFinite(o) || o < 0 || o >= t.m.n()) {
            d3.select("#topic_view_help").classed("hidden", false);
            d3.select("#topic_view_main").classed("hidden", true);
            view.loading(false);
            return true
        }
        n = utils.shorten(t.m.topic_words(o), VIS.topic_view.words);
        view.topic({
            t: o,
            words: n,
            label: t.m.topic_label(o)
        });
        d3.select("#topic_view_help").classed("hidden", true);
        d3.select("#topic_view_main").classed("hidden", false);
        t.m.total_tokens(function(e) {
            t.m.topic_total(o, function(i) {
                view.topic.remark({
                    alpha: t.m.alpha(o),
                    col_sum: i,
                    total_tokens: e
                })
            })
        });
        view.topic.words(n);
        t.m.topic_conditional(o, t.condition, function(e) {
            view.topic.conditional({
                t: o,
                condition: e.has(i) ? i : undefined,
                type: VIS.condition.type,
                condition_name: t.condition_name,
                data: e,
                key: t.m.meta_condition(t.condition),
                transition: t.updating
            })
        });
        view.calculating("#topic_docs", true);
        r = function(e) {
            view.calculating("#topic_docs", false);
            view.topic.docs({
                t: o,
                docs: e,
                citations: e.map(function(e) {
                    return t.bib.citation(t.m.meta(e.doc))
                }),
                condition: i,
                type: VIS.condition.type,
                condition_name: t.condition_name,
                key: t.m.meta_condition(t.condition),
                proper: t.proper
            })
        };
        if (i === undefined) {
            t.m.topic_docs(o, VIS.topic_view.docs, r)
        } else {
            t.m.topic_docs_conditional(o, t.condition, i, VIS.topic_view.docs, r)
        }
        view.loading(false);
        return true
    });
    t.views.set("word", function(e) {
        var i = d3.select("div#word_view"),
            n = e,
            o, r = 0;
        if (!t.m.tw()) {
            view.loading(true);
            return true
        }
        view.loading(false);
        if (n) {
            i.select("#word_view_help").classed("hidden", true)
        } else {
            i.select("#word_view_help").classed("hidden", false);
            if (VIS.last.word) {
                n = VIS.last.word;
                i.select("a#last_word").attr("href", "#/word/" + n).text(document.URL.replace(/#.*$/, "") + "#/word/" + n);
                i.select("#last_word_help").classed("hidden", false)
            } else {
                i.select("#word_view_main").classed("hidden", true);
                view.word({
                    word: undefined
                });
                return true
            }
        }
        i.select("#word_view_main").classed("hidden", false);
        t.updating = n === VIS.last.word;
        VIS.last.word = n;
        o = t.m.word_topics(n).filter(function(e) {
            return !VIS.topic_hidden[e.topic] || VIS.show_hidden_topics
        });
        if (o.length > 0) {
            r = 1 + d3.max(o, function(e) {
                return e.rank
            });
            r = d3.max(o, function(e) {
                return t.m.topic_words(e.topic, r).length
            })
        }
        r = Math.max(VIS.word_view.n_min, r);
        view.word({
            word: n,
            topics: o,
            words: o.map(function(e) {
                return t.m.topic_words(e.topic, r).slice(0, r)
            }),
            n: r,
            n_topics: t.m.n(),
            labels: o.map(function(e) {
                return t.m.topic_label(e.topic)
            }),
            updating: t.updating
        });
        return true
    });
    t.views.set("words", function() {
        var e;
        if (!t.m.tw()) {
            view.loading(true);
            return true
        }
        view.loading(false);
        if (!VIS.show_hidden_topics) {
            e = d3.range(t.m.n()).filter(function(e) {
                return !VIS.topic_hidden[e]
            })
        }
        return view.words(t.m.vocab(e))
    });
    t.views.set("doc", function(e) {
        var i = d3.select("div#doc_view"),
            n = +e;
        if (!t.m.meta() || !t.m.has_dt() || !t.m.tw()) {
            view.loading(true);
            return true
        }
        view.loading(false);
        if (!isFinite(n) || n < 0 || n >= t.m.n_docs()) {
            d3.select("#doc_view_help").classed("hidden", false);
            if (VIS.last.doc === undefined) {
                d3.select("#doc_view_main").classed("hidden", true);
                return true
            }
            n = VIS.last.doc;
            i.select("a#last_doc").attr("href", "#/doc/" + n).text(document.URL.replace(/#.*$/, "") + "#/doc/" + n);
            i.select("#last_doc_help").classed("hidden", false)
        } else {
            d3.select("#doc_view_help").classed("hidden", true);
            VIS.last.doc = n
        }
        d3.select("#doc_view_main").classed("hidden", false);
        view.calculating("#doc_view", true);
        t.m.doc_topics(n, t.m.n(), function(e) {
            var i = e.filter(function(e) {
                return !VIS.topic_hidden[e.topic] || VIS.show_hidden_topics
            });
            view.calculating("#doc_view", false);
            view.doc({
                topics: i,
                citation: t.bib.citation(t.m.meta(n)),
                url: t.bib.url(t.m.meta(n)),
                total_tokens: d3.sum(i, function(e) {
                    return e.weight
                }),
                words: i.map(function(e) {
                    return t.m.topic_words(e.topic, VIS.overview_words)
                }),
                labels: i.map(function(e) {
                    return t.m.topic_label(e.topic)
                }),
                proper: t.proper
            });
            c()
        });
        return true
    });
    t.views.set("bib", function(e, i, n) {
        var o = {
                major: e,
                minor: i,
                dir: n
            },
            r;
        if (!t.m.meta()) {
            view.loading(true);
            return true
        }
        o = t.bib.sort.validate(o);
        if (o.minor === undefined) {
            if (o.major === undefined) {
                o.minor = VIS.last.bib.minor || VIS.bib_view.minor
            } else {
                o.minor = VIS.bib_view.minor
            }
        }
        if (o.major === undefined) {
            o.major = VIS.last.bib.major || VIS.bib_view.major
        }
        if (o.dir === undefined) {
            o.dir = VIS.last.bib.dir || VIS.bib_view.dir
        }
        VIS.last.bib = o;
        o.docs = t.m.meta();
        r = t.bib.sort({
            major: o.major,
            minor: o.minor,
            dir: t.bib.sort.dir(o),
            docs: t.m.meta()
        });
        if (!t.citations) {
            t.citations = t.m.meta().map(t.bib.citation)
        }
        view.bib.dropdown(t.bib.sorting());
        view.bib({
            ordering: r,
            major: o.major,
            minor: o.minor,
            dir: o.dir,
            citations: t.citations
        });
        view.loading(false);
        return true
    });
    t.views.set("about", function() {
        view.about(t.m.info());
        view.loading(false);
        d3.select("#about_view").classed("hidden", false);
        return true
    });
    n = function() {
        var e = {
            max_words: t.m.n_top_words(),
            max_docs: t.m.n_docs()
        };
        if (e.max_words === undefined || e.max_docs === undefined) {
            return false
        }
        if (!t.settings_ready) {
            view.settings(e);
            t.settings_ready = true
        }
        $("#settings_modal").modal();
        return true
    };
    i.settings_modal = n;
    t.views.set("model", function(e, i, n) {
        var d = e || VIS.last.model || "grid";
        if (!t.m.tw() || !t.m.topic_scaled()) {
            view.loading(true);
            return true
        }
        d3.selectAll("#nav_model li.active").classed("active", false);
        d3.select("#nav_model_" + d).classed("active", true);
        d3.select("#model_view_plot").classed("hidden", true);
        d3.select("#model_view_list").classed("hidden", true);
        d3.select("#model_view_conditional").classed("hidden", true);
        d3.selectAll(".model_view_grid").classed("hidden", true);
        d3.selectAll(".model_view_scaled").classed("hidden", true);
        d3.selectAll(".model_view_list").classed("hidden", true);
        d3.selectAll(".model_view_conditional").classed("hidden", true);
        d3.select("#model_view nav").classed("hidden", false);
        if (d === "list") {
            if (!t.m.meta() || !t.m.has_dt()) {
                view.loading(true);
                return true
            }
            o(i, n);
            d3.select("#model_view_list").classed("hidden", false)
        } else if (d === "conditional") {
            if (!t.m.meta() || !t.m.has_dt()) {
                view.loading(true);
                return true
            }
            a(i);
            d3.select("#model_view_conditional").classed("hidden", false)
        } else {
            if (!t.m.topic_scaled() || !t.m.has_dt()) {
                view.loading(true);
                return true
            }
            if (d !== "scaled" || t.m.topic_scaled().length !== t.m.n()) {
                d = "grid"
            }
            r(d);
            d3.select("#model_view_plot").classed("hidden", false)
        }
        VIS.last.model = d;
        d3.selectAll(".model_view_" + d).classed("hidden", false);
        view.loading(false);
        return true
    });
    o = function(e, i) {
        view.calculating("#model_view_list", true);
        t.m.topic_total(undefined, function(n) {
            t.m.topic_conditional(undefined, t.condition, function(o) {
                view.calculating("#model_view_list", false);
                view.model.list({
                    data: o,
                    condition_name: t.condition_name,
                    type: VIS.condition.type,
                    key: t.m.meta_condition(t.condition),
                    sums: n,
                    words: t.m.topic_words(undefined, VIS.overview_words),
                    sort: e,
                    dir: i,
                    labels: d3.range(t.m.n()).map(t.m.topic_label),
                    topic_hidden: VIS.topic_hidden
                });
                c()
            })
        });
        return true
    };
    r = function(e) {
        t.m.topic_total(undefined, function(i) {
            var n = d3.range(t.m.n());
            if (!VIS.show_hidden_topics) {
                n = n.filter(function(e) {
                    return !VIS.topic_hidden[e]
                })
            }
            view.model.plot({
                type: e,
                topics: n.map(function(e) {
                    return {
                        t: e,
                        words: t.m.topic_words(e, VIS.model_view.plot.words),
                        scaled: t.m.topic_scaled(e),
                        total: i[e],
                        label: t.m.topic_label(e)
                    }
                })
            })
        });
        return true
    };
    a = function(e) {
        var i = {
            type: e,
            key: t.m.meta_condition(t.condition),
            condition_type: VIS.condition.type,
            condition_name: t.condition_name,
            streamgraph: VIS.model_view.conditional.streamgraph,
            signature: l()
        };
        view.calculating("#model_view_conditional", true);
        t.m.conditional_total(t.condition, undefined, function(e) {
            t.m.topic_conditional(undefined, t.condition, function(n) {
                i.conditional_totals = e;
                i.topics = n.map(function(e, i) {
                    return {
                        t: i,
                        wts: e,
                        words: t.m.topic_words(i, VIS.model_view.conditional.words),
                        label: t.m.topic_label(i)
                    }
                }).filter(function(e) {
                    return VIS.show_hidden_topics || !VIS.topic_hidden[e.t]
                });
                view.model.conditional(i);
                view.calculating("#model_view_conditional", false)
            })
        });
        return true
    };
    d = function() {
        var e = window.location.hash,
            n, o, r, a = false,
            d;
        if (t.aliases) {
            t.aliases.forEach(function(t, i) {
                e = e.split(t).join(i)
            })
        }
        n = e.split("/");
        if (n[0] !== "#") {
            n = t.default_view
        }
        o = n[1];
        t.updating = false;
        if (t.cur_view) {
            t.updating = o === t.cur_view;
            if (!t.updating) {
                d3.select("#" + t.cur_view + "_view").classed("hidden", true)
            }
        }
        r = n.slice(2, n.length);
        if (t.views.has(o)) {
            a = t.views.get(o).apply(i, r)
        }
        if (a) {
            if (typeof a === "string") {
                r = [undefined].concat(a.split("/"))
            }
            t.cur_view = o;
            VIS.annotes.forEach(function(e) {
                d3.selectAll(e).classed("hidden", true)
            });
            VIS.annotes = [".view_" + o];
            for (d = 1; d < r.length; d += 1) {
                VIS.annotes[d] = VIS.annotes[d - 1] + "_" + r[d]
            }
            VIS.annotes.forEach(function(e) {
                d3.selectAll(e).classed("hidden", false)
            })
        } else {
            if (t.cur_view === undefined) {
                t.cur_view = t.default_view[1];
                t.views.get("default")()
            }
        }
        if (!t.updating) {
            view.scroll_top()
        }
        c();
        d3.select("#" + t.cur_view + "_view").classed("hidden", false);
        d3.selectAll("#nav_main > li.active").classed("active", false);
        d3.select("li#nav_" + o).classed("active", true);
        d3.selectAll("#nav_main li:not(.active) > .nav").classed("hidden", true);
        d3.selectAll("#nav_main li.active > .nav").classed("hidden", false)
    };
    i.refresh = d;
    s = function(e) {
        window.location.hash = e
    };
    i.set_view = s;
    c = function(e) {
        var t = e === undefined ? !VIS.show_hidden_topics : e;
        d3.selectAll(".hidden_topic").classed("hidden", function() {
            return t
        })
    };
    i.hide_topics = c;
    l = function() {
        return VIS.show_hidden_topics
    };
    u = function() {
        window.onhashchange = function() {
            d()
        };
        $(window).resize(function() {
            if (VIS.resize_timer) {
                window.clearTimeout(VIS.resize_timer)
            }
            VIS.resize_timer = window.setTimeout(function() {
                d();
                VIS.resize_timer = undefined
            }, VIS.resize_refresh_delay)
        });
        d3.select("#nav_settings a").on("click", function() {
            d3.event.preventDefault();
            n()
        });
        $("#settings_modal").on("hide.bs.modal", function() {
            d()
        })
    };
    i.setup_listeners = u;
    f = function() {
        var e = t.m.info();
        view.frame({
            title: e ? e.title : undefined
        });
        t.default_view = VIS.default_view.split("/");
        if (!t.views.has(t.default_view[1])) {
            view.warning("Invalid VIS.default_view setting.");
            t.default_view = ["", "model"]
        }
        t.views.set("default", t.views.get(t.default_view[1]));
        t.aliases = d3.map(VIS.aliases)
    };
    i.setup_views = f;
    p = function(e, t) {
        var i, n;
        if (e === undefined) {
            return t("target undefined", undefined)
        }
        i = e.replace(/^.*\//, "");
        n = d3.select("#m__DATA__" + i.replace(/\..*$/, ""));
        if (!n.empty()) {
            return t(undefined, JSON.parse(n.html()))
        }
        if (e.search(/\.zip$/) > 0) {
            return d3.xhr(e).responseType("arraybuffer").get(function(e, n) {
                var o, r;
                if (n && n.status === 200 && n.response.byteLength) {
                    o = new JSZip(n.response);
                    r = o.file(i.replace(/\.zip$/, "")).asText()
                }
                return t(e, r)
            })
        }
        return d3.text(e, function(e, i) {
            return t(e, i)
        })
    };
    i.load_data = p;
    m = function() {
        p(VIS.files.info, function(e, i) {
            if (typeof i === "string") {
                t.m.info(JSON.parse(i));
                VIS.update(t.m.info().VIS)
            } else {
                view.warning("Unable to load model info from " + VIS.files.info)
            }
            if (t.metadata === undefined) {
                if (VIS.metadata.type === "base") {
                    t.metadata = metadata(VIS.metadata.spec)
                } else if (VIS.metadata.type === "dfr") {
                    t.metadata = metadata.dfr(VIS.metadata.spec)
                } else {
                    t.metadata = metadata.dfr();
                    view.warning("Unknown metadata.type; defaulting to dfr.")
                }
            }
            if (t.bib === undefined) {
                t.bib = bib.dfr(VIS.bib)
            }
            u();
            f();
            p(VIS.files.meta, function(e, i) {
                if (typeof i === "string") {
                    t.metadata.from_string(i);
                    t.condition = VIS.condition.spec.field;
                    t.condition_name = VIS.condition.name || t.condition;
                    t.metadata.condition(t.condition, metadata.key[VIS.condition.type], VIS.condition.spec);
                    t.m.set_meta(t.metadata);
                    d()
                } else {
                    view.error("Unable to load metadata from " + VIS.files.meta)
                }
            });
            p(VIS.files.dt, function(e, i) {
                t.m.set_dt(i, function(e) {
                    if (e.success) {
                        t.proper = VIS.proper;
                        if (t.proper === undefined) {
                            t.proper = e.proper
                        }
                        d3.selectAll(".proper").classed("hidden", !t.proper);
                        d3.selectAll(".not-proper").classed("hidden", t.proper);
                        d()
                    } else {
                        view.error("Unable to load document topics from " + VIS.files.dt)
                    }
                })
            });
            p(VIS.files.tw, function(e, i) {
                if (typeof i === "string") {
                    t.m.set_tw(i);
                    VIS.topic_hidden = d3.range(t.m.n()).map(function(e) {
                        return VIS.hidden_topics.indexOf(e + 1) !== -1
                    });
                    view.topic.dropdown(d3.range(t.m.n()).map(function(e) {
                        return {
                            topic: e,
                            words: t.m.topic_words(e, VIS.model_view.words),
                            label: t.m.topic_label(e),
                            hidden: VIS.topic_hidden[e]
                        }
                    }));
                    d()
                } else {
                    view.error("Unable to load topic words from " + VIS.files.tw)
                }
            });
            p(VIS.files.topic_scaled, function(e, i) {
                if (typeof i === "string") {
                    t.m.set_topic_scaled(i)
                } else {
                    t.m.set_topic_scaled("");
                    d3.select("#nav_model_scaled").classed("disabled", true).select("a").attr("href", "#/model/scaled")
                }
                d()
            });
            d()
        })
    };
    i.load = m;
    return i
};
