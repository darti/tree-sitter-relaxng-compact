module.exports = grammar({
    name: 'relaxng_compact',

    extras: $ => [
        /\s/,
        $.line_comment,
    ],

    word: $ => $.identifier,

    rules: {

        source_file: $ => seq(
            repeat($.decl),
            choice($._pattern, optional($.grammar_content))),

        decl: $ => choice($.namespace, $.default_namespace),

        namespace: $ => seq(
            'namespace',
            $.identifier,
            '=',
            $.literal
        ),
        default_namespace: $ => seq(
            'default',
            'namespace',
            optional($.identifier),
            '=',
            $.literal
        ),

        _pattern: $ => choice(
            seq('elemen', $.name_class, '{', $._pattern, '}'),
            // "attribute" nameClass "{" pattern "}"
            alias(prec.left(1, seq($._pattern, ',', $._pattern)), $.concat),
            prec.left(1, seq($._pattern, '&', $._pattern)),
            alias(prec.left(1, seq($._pattern, '|', $._pattern)), $.union),

            prec(2, seq($._pattern, '?')),
            prec(2, seq($._pattern, '*')),
            prec(2, seq($._pattern, '+')),

            seq('list', '{', $._pattern, '}'),
            seq('mixed', '{', $._pattern, '}'),

            $.identifier,
            seq('parent', $.identifier),
            'empty',
            'text',
            // [datatypeName] datatypeValue
            // datatypeName["{" param * "}"][exceptPattern],
            'notAllowed',
            // "external" anyURILiteral[inherit]
            seq('grammar', '{', repeat($.grammar_content), '}'),
            seq('(', $._pattern, ')')

        ),



        grammar_content: $ => choice(
            $.start,
            $.define,
            seq('div', '{', repeat($.grammar_content), '}'),
            // include
        ),

        start: $ => seq(
            "start",
            $._assignMethod,
            $._pattern
        ),

        define: $ => seq(
            $.identifier,
            $._assignMethod,
            $._pattern
        ),


        // utils

        _assignMethod: $ => choice('=', '|=', '&='),

        identifier: $ => /[_\p{XID_Start}][\._\p{XID_Continue}]*/,

        namespaceURILiteral: $ => choice(
            'inherit',

        ),

        literal: $ => choice(
            seq('"', '"'),
            seq('"', $.string_content, '"')
        ),

        string_content: $ => repeat1(choice(
            token.immediate(prec(1, /[^\\"\n]+/)),
            $.escape_sequence
        )),

        escape_sequence: $ => token.immediate(
            seq('\\',
                choice(
                    /[^xu]/,
                    /u[0-9a-fA-F]{4}/,
                    /u{[0-9a-fA-F]+}/,
                    /x[0-9a-fA-F]{2}/
                )
            )),

        name_class: $ => choice(
            $.identifier,

        ),

        keyword: $ => choice(
            'attribute',
            'default',
            'datatypes',
            'div',
            'element',
            'empty',
            'external',
            'grammar',
            'include',
            'inherit',
            'list',
            'mixed',
            'namespace',
            'notAllowed',
            'parent',
            'start',
            'string',
            'text',
            'token',
        ),

        line_comment: $ => token(seq(
            '#', /.*/
        )),

    }
});