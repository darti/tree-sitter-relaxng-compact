module.exports = grammar({
    name: 'relaxng_compact',

    extras: $ => [
        /\s/
    ],

    supertypes: $ => [

    ],
    inline: $ => [
        $._grammar_exts,
        $._sign
    ],

    word: $ => $.identifier,

    rules: {

        source_file: $ => repeat($.decl),
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
        identifier: $ => /[_\p{XID_Start}][_\p{XID_Continue}]*/,
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
        )



    }
});