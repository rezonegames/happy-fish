
const x = [
    {
        "bezierId": 1,
        "desc": "普通",
        "point": [
            [
                50,
                -100,
                10
            ],
            [
                300,
                -400,
                10
            ],
            [
                1800,
                -650,
                10
            ]
        ]
    },
    {
        "bezierId": 2,
        "desc": "普通",
        "point": [
            [
                100,
                -200,
                10
            ],
            [
                400,
                -300,
                10
            ],
            [
                1800,
                -600,
                10
            ]
        ]
    },
    {
        "bezierId": 3,
        "desc": "普通",
        "point": [
            [
                50,
                50,
                10
            ],
            [
                400,
                100,
                10
            ],
            [
                1800,
                200,
                10
            ]
        ]
    },
    {
        "bezierId": 4,
        "desc": "普通",
        "point": [
            [
                80,
                200,
                10
            ],
            [
                300,
                500,
                10
            ],
            [
                1800,
                650,
                10
            ]
        ]
    },
    {
        "bezierId": 5,
        "desc": "普通",
        "point": [
            [
                100,
                100,
                10
            ],
            [
                350,
                400,
                10
            ],
            [
                1800,
                550,
                10
            ]
        ]
    },
    {
        "bezierId": 6,
        "desc": "普通",
        "point": [
            [
                100,
                2,
                10
            ],
            [
                350,
                -2,
                10
            ],
            [
                1800,
                0,
                10
            ]
        ]
    },
    {
        "bezierId": 7,
        "desc": "普通",
        "point": [
            [
                100,
                2,
                10
            ],
            [
                400,
                -2,
                10
            ],
            [
                1800,
                0,
                10
            ]
        ]
    }
];

for (let i=0;i<x.length;i++) {
    let v = x[i];
    let m = []
    for (let j=0;j<v.point.length;j++) {
        let k = v.point[j];
        m.push({
            x: k[0],
            y: k[1],
            seconds: 3,
        })
    }

    console.log(JSON.stringify(m));
}